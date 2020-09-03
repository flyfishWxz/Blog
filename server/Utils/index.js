const crypto=require('crypto')//加密中间件
const fs=require('fs')
const multer=require('multer')//上传图片中间件
const path=require('path')
function md5(s){//加密函数
    //注意参数要为String类型，否则会报错
    return crypto.createHash('md5').update(String(s)).digest('hex')
}
//将二进制图片文件转化为原本格式的文件，并放入public静态资源文件中
var upload = multer({ 
    storage:multer.diskStorage({
        destination: function (req, file, cb) {
            let date=new Date()
            let year=date.getFullYear()
            let month=(date.getMonth()+1).toString().padStart(2,'0')
            let day=date.getDate()
            //设置文件存储位置和文件夹名字
            let dir = path.join(__dirname,'../public/uploads/'+year+month+day)

            //判断文件是否存在，不存在则创建
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir,{recursive:true})
            }
            cb(null, dir)//dir就是上传文件存放路径
        },
        //设置文件名称
        filename:function (req, file, cb) {
            let filename=Date.now()+path.extname(file.originalname)
            //文件名是时间+格式后缀
            cb(null,filename)
        }
    }) 
})
module.exports={md5,upload}