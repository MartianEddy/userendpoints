import express from 'express'
import { createUser, deleteUser, getUserByUsername, getUsers, homepage, loginUser, updateUser, resetPassword } from '../Controller/usercontroller'
import { Allow } from '../middleware/allow'
import { VerifyToken } from '../middleware/verify'
const router=express.Router()


router.post('/create', createUser)
router.post('/login', loginUser)
router.get('/', getUsers)
router.get('/home',VerifyToken, )
router.get('/:email', getUserByUsername)
router.patch('/:id', updateUser)
router.patch('/:id', resetPassword)
router.delete('/:id',VerifyToken, deleteUser)





export default router