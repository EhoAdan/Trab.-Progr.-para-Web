import express from 'express';
import alunoController from '../controllers/AlunoController.js';

const router = express.Router();

router.get('/', alunoController.listarTodos);
router.get('/:id', alunoController.buscarPorId);
router.post('/', alunoController.criar);
router.put('/:id', alunoController.atualizar);
router.delete('/:id', alunoController.remover);
router.post('/:alunoId/disciplinas/:disciplinaId', alunoController.adicionarDisciplinaComNota);
router.get('/:id/boletim', alunoController.listarBoletim);


export default router;
