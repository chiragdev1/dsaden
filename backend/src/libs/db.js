import {PrismaClient} from '../generated/prisma/index.js'

const globalPrismaThis = globalThis 

export const db = globalPrismaThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== "Production")globalPrismaThis.prisma = db