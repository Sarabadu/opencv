const cv =  require("opencv4nodejs");


function resize (img,height = 800){
    //img = new cv.Mat();
    console.debug(img.sizes)
    let rat = height / img.sizes[0]	    

    return img.resize( height,Math.floor(rat * img.sizes[1]))
}
async function main () {
    try {
        let img = await cv.imread("./img/cheque.jpg")
        img = resize(img)
        cv.imwrite("./res/resize.jpg",img)

        img = img.cvtColor(cv.COLOR_BGR2GRAY);
        cv.imwrite("./res/gray.jpg",img)

        img = img.bilateralFilter( 1, 10, 75)
        cv.imwrite("./res/bilat.jpg",img)

        img = img.adaptiveThreshold( 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 71, 2)
        cv.imwrite("./res/adapth.jpg",img)

        img = img.medianBlur( 5)
        cv.imwrite("./res/mblur.jpg",img)

        img = img.copyMakeBorder( 5, 5, 5, 5, cv.BORDER_CONSTANT,0 )//new cv.Vec3(0,0,0))
        cv.imwrite("./res/borde.jpg",img)
        
        img = img.canny( 200, 250)
        cv.imwrite("./res/canny.jpg",img)

        let conts = img.findContours(cv.RETR_TREE,cv.CHAIN_APPROX_SIMPLE)
        


        /////

        height = img.sizes[0]	
        width = img.sizes[1]	
        
        MAX_COUNTOUR_AREA = (width - 10) * (height - 10)	
        
        maxAreaFound = MAX_COUNTOUR_AREA * 0.3

        pageContour = [[5, 5], [5, height-5], [width-5, height-5], [width-5, 5]]

        for (const cnt of conts) {
            let perimeter = cnt.arcLength( true)
            let approx = cnt.approxPolyDPContour( 0.03 * perimeter, true)
            if (approx.getPoints().length == 4 && 
                approx.isConvex &&
                maxAreaFound < approx.area < MAX_COUNTOUR_AREA
            ){
                maxAreaFound = approx.area
                pageContour = approx
            }
            
        }
        
        img = img.cvtColor(cv.COLOR_GRAY2BGR)
        img.drawPolylines([pageContour.getPoints()],true,new cv.Vec3(0,255,0))
        cv.imwrite("./res/poly.jpg",img)
        //let c = new cv.Contour();
        //c.
        console.debug(conts[0])
    }
    catch (e) {
        console.log(e)
    }
}



async function main2 () {
try {
    let mat = await cv.imreadAsync("./img/cheque.jpg")
bgr=  mat.split();
mat = mat.bgrToGray()


//mat = mat.medianBlur(3)
//mat = mat.bilateralFilter(1,1,1)
//mat = mat.threshold(120,255,cv.THRESH_BINARY)
//mat = mat.gaussianBlur(new cv.Size(3,3),5)

//mat = mat.adaptiveThreshold(255,cv.ADAPTIVE_THRESH_GAUSSIAN_C,cv.THRESH_BINARY_INV,7,2)
//mat = mat.dilate(new cv.Mat([[1,1],[1,1]],1),new cv.Point2(1,1),10,1)
mat = mat.canny(10,255,3,true)
conts = mat.findContours(cv.RETR_EXTERNAL,cv.CHAIN_APPROX_SIMPLE).sort((c,d) => d.area - c.area)
//console.debug(conts.getPoints())
//let c = new cv.Contour()
//c.getPoints()
//mat = mat.cvtColor(cv.COLOR_GRAY2BGR)
//mat.drawPolylines([conts.getPoints()],true,new cv.Vec3(0,255,0),10,1)
mat.drawContours(conts,new cv.Vec3(0,255,0),-1)


cv.imwrite("./img/r.jpg",bgr[0])
cv.imwrite("./img/g.jpg",bgr[1])
cv.imwrite("./img/b.jpg",bgr[2])
//cv.imshow("lala", mat )
cv.imwrite("./img/cheque1.jpg",mat)
}
catch(e) {
    console.log(e)
}
} 

main();


