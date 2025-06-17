import express from 'express';
import disciplinaController from '../controllers/DisciplinaController.js';

const router = express.Router();

router.get('/', disciplinaController.listarTodos);
router.get('/:id', disciplinaController.buscarPorId);
router.post('/', disciplinaController.criar);
router.put('/:id', disciplinaController.atualizar);
router.delete('/:id', disciplinaController.remover);

export default router;
