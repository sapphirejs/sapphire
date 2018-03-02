class SimpleClass {
    constructor(parameter) {
        this._parameter = parameter
    }

    getParameter() {
        return this._parameter
    }

    setParameter(parameter) {
        this._parameter = parameter
    }
}

module.exports = SimpleClass