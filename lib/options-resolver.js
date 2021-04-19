class OptionsResolver {


    constructor(options) {
        this.options = options;
    }

    get isPackage() {
        if (!this.options.hasOwnProperty('package')) {
            return true;
        }

        return this.options.package && this.options.package === true;
    }

    get isCorsEnabled() {
        if (!this.options.hasOwnProperty('cors')) {
            console.log('here')

            return false;
        }
        console.log(this.options.cors)
        return this.options.cors && (this.options.cors === true || this.options.cors === "true")
    }

    get inputFile() {
        if (!this.options.inputFile) {
            throw new TypeError('Missing argument inputFile');
        }

        return this.options.inputFile;
    }

    get inputDirectory() {
        if (!this.options.inputDirectory) {
            return './';
        }

        return this.options.inputDirectory;
    }

    get outputFile() {
        if (!this.options.outputFile) {
            return 'api.yml';
        }

        return this.options.outputFile;
    }

    get outputDirectory() {
        if (!this.options.outputDirectory) {
            return 'openapi-integration/';
        }

        return this.options.outputDirectory.replace(/\/?$/, '/');
    }

    _mappingPath(stage) {
        if (!this.options.mapping) {
            throw new TypeError('Missing argument mapping');
        }

        let path = null;
        this.options.mapping.forEach(function (mapping) {
            if (mapping.stage === stage) {
                path = mapping.path;
            }
        });

        if (path === null) {
            throw new TypeError(`Missing integration mapping for the ${stage} stage`);
        }

        return path;
    }

    _validate() {
        let allowedConfigurations = ['package', 'inputFile', 'inputDirectory', 'outputDirectory', 'outputFile', 'mapping', 'cors'];
        Object.entries(this.options).forEach(([key, value]) => {
            if (!allowedConfigurations.includes(key)){
                throw new Error(`unrecognized option ${key}. 
            Allowed options are package, inputFile, inputDirectory, outputDirectory, outputFile, mapping, cors`);
            }
        })
    }

    resolve(stage = "dev") {
        this._validate();
        return {
            package: this.isPackage,
            cors: this.isCorsEnabled,
            inputFile: this.inputFile,
            inputDirectory: this.inputDirectory,
            inputFullPath: this.inputDirectory + this.inputFile,
            outputFile: this.outputFile,
            outputDirectory: this.outputDirectory,
            outputFullPath: this.outputDirectory + this.outputFile,
            integrationPath: this._mappingPath(stage)
        }
    }
}

module.exports = OptionsResolver;