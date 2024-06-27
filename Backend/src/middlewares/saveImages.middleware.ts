import multer from 'multer';
import FirebaseStorage from 'multer-firebase-storage';

const upload = multer({
  storage: FirebaseStorage({
    bucketName: process.env.FIREBASE_STORAGEBUCKET,
    credentials: {
      clientEmail: process.env.FIREBASE_EMAIL as string,
      privateKey: process.env.FIREBASE_PRIVATEKEY as string,
      projectId: process.env.FIREBASE_PROJECTID as string,
    },
    directoryPath: 'reports',
    unique: true,
    public: false,
  })
});

export { upload };
