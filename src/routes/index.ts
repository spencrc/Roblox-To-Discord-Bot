import { Router } from 'express';
const router = Router();

export default router.get('/', (req, res) => {
	res.send('Welcome to the Roblox Verification API! This is not a website, but an API.');
});
