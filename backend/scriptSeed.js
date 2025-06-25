import db from './database/index.js';

const seed = async () => {
  try {
    await db.sequelize.sync();
    console.log('🟢 Banco sincronizado (sem apagar dados).');

    const alunosExistem = await db.Aluno.count();
    const professoresExistem = await db.Professor.count();
    const disciplinasExistem = await db.Disciplina.count();

    if (alunosExistem || professoresExistem || disciplinasExistem) {
      console.log('⚠️ Dados já existem no banco. Seed não foi executado novamente.');
      process.exit();
    }
    const [prof1, prof2] = await Promise.all([
      db.Professor.create({ nome: 'Prof. Ana', email: 'ana@escola.com', senha: '1234' }),
      db.Professor.create({ nome: 'Prof. Bruno', email: 'bruno@escola.com', senha: '1234' }),
    ]);
    const [disc1, disc2, disc3] = await Promise.all([
      db.Disciplina.create({ nome: 'Matemática', codigo: 'MAT101', professorId: prof1.id }),
      db.Disciplina.create({ nome: 'História', codigo: 'HIS202', professorId: prof2.id }),
      db.Disciplina.create({ nome: 'Física', codigo: 'FIS303', professorId: prof1.id }),
    ]);
    const [aluno1, aluno2] = await Promise.all([
      db.Aluno.create({ nome: 'Carlos', email: 'carlos@aluno.com', senha: '1234' }),
      db.Aluno.create({ nome: 'Débora', email: 'debora@aluno.com', senha: '1234' }),
    ]);
    await Promise.all([
      aluno1.addBoletim([disc1, disc2], { through: { nota: 8.5 } }),
      aluno2.addBoletim([disc2, disc3], { through: { nota: 7.0 } }),
    ]);

    console.log('✅ Seed executado com sucesso!');

  } catch (err) {
    console.error('❌ Erro ao executar seed:', err);
  } finally {
    await db.sequelize.close();
    process.exit();
  }
};

seed();

