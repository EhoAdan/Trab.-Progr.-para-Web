import express from 'express';
import alunoController from '../controllers/AlunoController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', alunoController.listarTodos);
router.get('/:id', alunoController.buscarPorId);
router.post('/', alunoController.criar);
router.put('/:id', alunoController.atualizar);
router.delete('/:id', alunoController.remover);
router.post('/:alunoId/disciplinas/:disciplinaId', alunoController.adicionarDisciplinaComNota);
//chama o authMiddleware além de listarBoletim para a conferência de autenticação
router.get('/:id/boletim', authMiddleware, alunoController.listarBoletim);


export default router;
