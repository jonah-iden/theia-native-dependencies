const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs')

const modulesToBuild = [
    {name: "cpu-features", files: ['build/Release/cpufeatures.node'] },
    {name: "drivelist", files: ['build/Release/drivelist.node'] },
    {name: "find-git-repositories", files: ['build/Release/findGitRepos.node'] },
    {name: "keytar", files: ['build/Release/keytar.node'] },
    {name: "nsfw", files: ['build/Release/nsfw.node'] },
    {name: "node-pty", files: ['build/Release/pty.node'] },
    //{name: "ssh2", files: [] },
]

for(let module of modulesToBuild) {
    const modulePath = path.join(process.cwd(), 'node_modules' , module.name)
    execSync('node-gyp rebuild', {cwd: modulePath, stdio: 'inherit'});
    for(let file of module.files) {
        const dstDir = path.join(process.cwd(), 'artifacts', module.name);
        if(!fs.existsSync(dstDir)) {
            fs.mkdirSync(dstDir, {recursive: true});
        }
        fs.copyFileSync(
            path.join(modulePath.toString(), file), 
            path.join(dstDir, path.basename(file)));
    }
}