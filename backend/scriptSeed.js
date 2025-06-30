import db from './database/index.js';


const seed = async () => {
  try {
    await db.sequelize.sync();
    console.log('Banco sincronizado (sem apagar dados).');

    const alunosExistem = await db.Aluno.count();
    const professoresExistem = await db.Professor.count();
    const disciplinasExistem = await db.Disciplina.count();
    const turmasExistem = await db.Turma.count()

    if (alunosExistem || professoresExistem || disciplinasExistem || turmasExistem) {
      console.log('Dados já existem no banco. Seed não foi executado novamente.');
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

    const [turm1, turm2, turm3, turm4, turm5, turm6, turm7, turm8, turm9, turm10, turm11, turm12] = await Promise.all([
      db.Turma.create({ nome: '1° série'}),
      db.Turma.create({ nome: '2° série'}),
      db.Turma.create({ nome: '3° série'}),
      db.Turma.create({ nome: '4° série'}),
      db.Turma.create({ nome: '5° série'}),
      db.Turma.create({ nome: '6° série'}),
      db.Turma.create({ nome: '7° série'}),
      db.Turma.create({ nome: '8° série'}),
      db.Turma.create({ nome: '9° série'}),
      db.Turma.create({ nome: '1° ano'}),
      db.Turma.create({ nome: '2° ano'}),
      db.Turma.create({ nome: '3° ano'}),
    ]);

    const [aluno1, aluno2] = await Promise.all([
      db.Aluno.create({ nome: 'Carlos', email: 'carlos@aluno.com', senha: '1234', turmaId: 2 }),
      db.Aluno.create({ nome: 'Débora', email: 'debora@aluno.com', senha: '1234', turmaId: 3}),
    ]);

    await Promise.all([
      aluno1.addBoletim([disc1, disc2], { through: { nota: 8.5 } }),
      aluno2.addBoletim([disc2, disc3], { through: { nota: 7.0 } }),
    ]);

    console.log('Seed executado com sucesso!');

  } catch (err) {

    console.error('Erro ao executar seed:', err);

  } finally {

    await db.sequelize.close();

    process.exit();
  }
};

seed();