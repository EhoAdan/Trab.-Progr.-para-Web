import express from 'express';
import alunoController from '../controllers/AlunoController.js'

const router = express.Router();

router.get('/', alunoController.listarTodos);
router.post('/', alunoController.criar);
router.post('/:alunoId/disciplinas/:disciplinaId', alunoController.associarDisciplina);

export default router;
