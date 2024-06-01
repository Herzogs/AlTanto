import express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()

const routesPath = path.join(__dirname, './')

// Read all files in the current directory and filter only the ones that end with .routes.ts
// Then, for each file, import the default export and add it to the router
// The route will be the file name without the .routes.ts extension
// For example, if we have a file named user.routes.ts, the route will be /user
fs.readdirSync(routesPath)
  .filter(file => file.endsWith('.routes.ts') && file !== 'index.routes.ts')
    .forEach(async file => {
        const subRoutes = (await import(`./${file}`)).default
        const route = file.replace('.routes.ts', '')
        //console.log(`Adding route /${route}`)
        router.use(`/${route}`, subRoutes)
    })

export default router