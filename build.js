const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const archiver = require('archiver'); 

const modulesToBuild = [
    {name: "cpu-features", files: ['build/Release/cpufeatures.node'] },
    {name: "drivelist", files: ['build/Release/drivelist.node'] },
    {name: "find-git-repositories", files: ['build/Release/findGitRepos.node'] },
    {name: "keytar", files: ['build/Release/keytar.node'] },
    {name: "nsfw", files: ['build/Release/nsfw.node'] },
    {name: "node-pty", files: ['build/Release/pty.node'] },
    //{name: "ssh2", files: [] },
]

const artifactsPath = path.join(process.cwd(), 'artifacts');

if(fs.existsSync(artifactsPath)) {
    fs.rmSync(artifactsPath, {recursive: true});
}

for(let module of modulesToBuild) {
    const modulePath = path.join(process.cwd(), 'node_modules' , module.name)
    execSync('node-gyp rebuild', {cwd: modulePath, stdio: 'inherit'});
    const dstDir = path.join(artifactsPath, module.name);
    for(let file of module.files) {
        if(!fs.existsSync(dstDir)) {
            fs.mkdirSync(dstDir, {recursive: true});
        }
        fs.copyFileSync(
            path.join(modulePath.toString(), file), 
            path.join(dstDir, path.basename(file)));
    }
    const archive = archiver('zip');
    const output = fs.createWriteStream(path.join(artifactsPath, `${module.name}.zip`), { flags: "w" });
    archive.pipe(output);
    archive.directory(dstDir, false);
    archive.finalize();
}