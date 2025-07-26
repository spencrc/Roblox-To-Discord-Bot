import { Router } from 'express';
const router = Router();

export default router.get('/', (req, res) => {
	res.send('Terms of Service');
});
