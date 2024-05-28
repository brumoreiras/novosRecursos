class UsuarioLogado {
    constructor() {
        if (UsuarioLogado.instance) {
            return UsuarioLogado.instance;
        }
        this.usuario = null;
        UsuarioLogado.instance = this;
    }

    static getInstance() {
        return UsuarioLogado.instance || new UsuarioLogado();
    }

    setUsuario(usuario) {
        this.usuario = usuario;
    }

    getUsuario() {
        return this.usuario;
    }

    removerUsuario() {
        this.usuario = null;
    }
}

module.exports = UsuarioLogado;
