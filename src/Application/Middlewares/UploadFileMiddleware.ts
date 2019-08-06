import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { RequestHandler } from 'express'

class UploadFileMiddleware { 
    public intercepter: RequestHandler;
    private config: multer.Options;
    private destination = path.resolve(__dirname, '..', '..', '..', 'public', 'uploads');
    
    constructor () {
        this.config = {
            dest: this.destination,
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.destination)
                },
                filename: (req, file, cb) => {
                    crypto.randomBytes(16, (err, hash) => {
                        if(err) cb(err, null)

                        const fileName = `${hash.toString('hex')}-${file.originalname}`
                        cb(null, fileName)
                    })
                }
            }),
            limits: {
                fileSize: 2 * 1024 * 1024
            },
            fileFilter: (req, file, cb) => {
                const allowedMimes = [
                    'image/jpeg',
                    'image/pjpeg',
                    'image/png',
                    'image/gif'
                ]

                if(allowedMimes.includes(file.mimetype)) {
                    cb(null, true)
                } else {
                    cb(new Error('Invalid file type.'), null)
                }
            }
        }
        
        this.intercepter = multer(this.config).single('file')
    }


 }

export default new UploadFileMiddleware().intercepter