const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

describe('API /usuarios', () => {
    let idUsuario;
    let tokenUsuario;

    test('POST /usuarios - Deve criar usuário (201)', async () => {
        const response = await request.post('/usuarios')
            .send({ email: "usuario@email.com", senha: "abcd1234" });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('email', 'usuario@email.com');
        
        idUsuario = response.body._id; // Salva para testes futuros
    });

    test('POST /usuarios - Deve falhar sem dados (422)', async () => {
        const response = await request.post('/usuarios').send({});
        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('msg', 'Email e Senha são obrigatórios');
    });

    test('POST /usuarios/login - Deve fazer login (200)', async () => {
        const response = await request.post('/usuarios/login')
            .send({ usuario: "usuario@email.com", senha: "abcd1234" });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        
        tokenUsuario = response.body.token; // Salva para testes futuros
    });

    test('POST /usuarios/login - Deve falhar login sem dados (401)', async () => {
        const response = await request.post('/usuarios/login').send({});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'Credenciais inválidas');
    });

    test('POST /usuarios/renovar - Deve renovar token (200)', async () => {
        const response = await request.post('/usuarios/renovar')
            .set('authorization', tokenUsuario);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('POST /usuarios/renovar - Deve falhar token inválido (401)', async () => {
        const response = await request.post('/usuarios/renovar')
            .set('authorization', 'Bearer 123456789');
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'Token invalido');
    });

    test('DELETE /usuarios/:id - Deve remover usuário (204)', async () => {
        const response = await request.delete(`/usuarios/${idUsuario}`)
            .set('authorization', tokenUsuario);
        
        expect(response.status).toBe(204);
    });
});