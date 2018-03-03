class FakeConfig {
    constructor(parameter) {
        this._parameter = parameter
    }

    getParameter() {
        return this._parameter
    }
}

module.exports = FakeConfig