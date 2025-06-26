import express from 'express';
import turmaController from '../controllers/TurmaController.js';

const router = express.Router();

router.post('/', turmaController.criar);
router.get('/', turmaController.listar);
router.get('/:id/alunos', turmaController.listarAlunos);

export default router;
