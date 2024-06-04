export async function deletarUsuario(id) {
    console.log('id :::: ', id)
    const confirmar = confirm('Tem certeza de que deseja deletar este usuário?');
    if (!confirmar) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3033/deletar-usuario?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            document.querySelector(`tr[data-id="${id}"]`).remove();
        } else {
            console.error('Erro ao deletar usuário:', response.statusText);
        }
    } catch (error) {
        console.error('Ocorreu um erro ao deletar o usuário:', error);
    }
}