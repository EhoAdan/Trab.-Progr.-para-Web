import express from 'express';
import professorController from '../controllers/ProfessorController.js';

const router = express.Router();

router.get('/', professorController.listarTodos);
router.get('/:id', professorController.buscarPorId);
router.post('/', professorController.criar);
router.put('/:id', professorController.atualizar);
router.delete('/:id', professorController.remover);

export default router;
