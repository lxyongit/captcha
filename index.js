const ffi = require('ffi-napi')
const path = require('path')
const ref = require('ref-napi')
const ArrayType = require('ref-array-napi')
const { readFile } = require('fs')
const ocrDllPath = path.resolve(__dirname, 'ocr.dll')
const byteArray = ArrayType(ref.types.byte)
const ocrDll = ffi.Library(ocrDllPath, {
    init: ['void', []],
    ocr: ['string', [byteArray, 'int']]
})

// 是否已初始化
let isCalled = false
/**
 * @param {Buffer | string} 图片的buffer数据或图片路径
 * @return string 识别到的二维码
 * */ 
 function codeOcr(imgBuffer) {
    codeOcr.init()
    return new Promise((resolve, reject) => {
        if(typeof imgBuffer === 'string') {
            readFile(imgBuffer, (err, data) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(ocrDll.ocr(data, data.length))
                }
            })
        } else {
            resolve(ocrDll.ocr(imgBuffer, imgBuffer.length))
        }
    })
}

codeOcr.init = () => {
    if(!isCalled) {
        ocrDll.init()
        isCalled = true
    }
}

module.exports = codeOcr
