import MinecraftClient from "./minecraftClient.js";
			const versionSelect = document.getElementById('version-select');
			let versionType = 'zip'; 
			fetch('./mc/versions.json')
  .then(res => res.json())
  .then(versions => {
    window.versionsData = versions; 
    versions.forEach((v, i) => {
      const opt = document.createElement('option');
      opt.value = v.jar;
      opt.textContent = v.name;
      opt.dataset.type = v.type || 'zip';
      if (v.class) opt.dataset.class = v.class;
      versionSelect.appendChild(opt);
    });
    const first = versions[0];
    window.selectedVersionClass = first?.class;
    window.selectedVersionLibraries = first?.libraries || [];
    window.selectedVersionJvmArgs = first?.jvmArgs || [];
    versionType = first?.type || 'zip';
    updateModUploadLabel();
  });
versionSelect.addEventListener('change', () => {
  const idx = versionSelect.selectedIndex;
  const selected = window.versionsData[idx] || {};
  window.selectedVersionClass = selected.class;
  window.selectedVersionLibraries = selected.libraries || [];
  window.selectedVersionJvmArgs = selected.jvmArgs || [];
  versionType = selected.type || 'zip';
  updateModUploadLabel();
  uploadedMods = [];
  updateModList();
});
			function updateModUploadLabel() {
				const label = document.querySelector('label[for="mod-upload"]');
				if (versionType === 'jar') {
					label.textContent = 'Upload Mod JAR:';
					modUpload.accept = '.jar';
				} else if (versionType === 'jar-zip') {
					label.textContent = 'Upload Mod ZIP or JAR:';
					modUpload.accept = '.zip,.jar';
				} else {
					label.textContent = 'Upload Mod ZIP:';
					modUpload.accept = '.zip';
				}
			}
			let moddedJarBlob = null;
			const modUpload = document.getElementById('mod-upload');
			const modList = document.getElementById('mod-list');
			let uploadedMods = [];
			function updateModList() {
				modList.innerHTML = '';
				uploadedMods.forEach((mod, idx) => {
					const li = document.createElement('li');
					li.textContent = mod.name + ' ';
					const removeBtn = document.createElement('button');
					removeBtn.textContent = 'Remove';
					removeBtn.onclick = () => {
						uploadedMods.splice(idx, 1);
						updateModList();
					};
					li.appendChild(removeBtn);
					modList.appendChild(li);
				});
			}
			const progress = document.querySelector('progress');
			const initStatus = document.getElementById('init-status');
window.uploadedMods = uploadedMods;
window.versionType = versionType;
const selected = versionSelect.options[versionSelect.selectedIndex];
window.selectedVersionClass = selected?.dataset.class || undefined;
			const playBtn = document.getElementById('play-btn');
			playBtn.addEventListener('click', async () => {
  progress.style.display = '';
  progress.value = 0;
  progress.max = 4;
  try {
    let jarBlob = null;
    let jarSource;
    if (initStatus) { initStatus.style.display = ''; initStatus.textContent = 'Initializing...'; }
    if (uploadedMods.length > 0 && versionType === 'zip') {
      jarBlob = await patchJarWithMods();
      jarSource = jarBlob;
    } else {
      jarSource = versionSelect.value;
    }
    window.uploadedMods = uploadedMods;
    window.versionType = versionType;
    progress.value = 1;
    if (initStatus) initStatus.textContent = 'Initializing CheerpJ...';
    await cheerpjInit({
      version: 8,
      javaProperties: ["java.library.path=/app/libraries/"],
      libraries: {"libGL.so.1": "/app/libraries/gl4es.wasm"},
      enableX11:true,
      preloadResources:{"/lt/8/jre/lib/rt.jar":[0,131072,1310720,1572864,4456448,4849664,5111808,5505024,7995392,8126464,9699328,9830400,9961472,11534336,11665408,12189696,12320768,12582912,13238272,13369344,15073280,15335424,15466496,15597568,15990784,16121856,16252928,16384000,16777216,16908288,17039360,17563648,17694720,17825792,17956864,18087936,18219008,18612224,18743296,18874368,19005440,19136512,19398656,19791872,20054016,20709376,20840448,21757952,21889024,26869760],"/lt/etc/users":[0,131072],"/lt/etc/localtime":[],"/lt/8/jre/lib/cheerpj-awt.jar":[0,131072],"/lt/8/lib/ext/meta-index":[0,131072],"/lt/8/lib/ext":[],"/lt/8/lib/ext/index.list":[],"/lt/8/lib/ext/localedata.jar":[],"/lt/8/jre/lib/jsse.jar":[0,131072,786432,917504],"/lt/8/jre/lib/jce.jar":[0,131072],"/lt/8/jre/lib/charsets.jar":[0,131072,1703936,1835008],"/lt/8/jre/lib/resources.jar":[0,131072,917504,1179648],"/lt/8/jre/lib/javaws.jar":[0,131072,1441792,1703936],"/lt/8/lib/ext/sunjce_provider.jar":[],"/lt/8/lib/security/java.security":[0,131072],"/lt/8/jre/lib/meta-index":[0,131072],"/lt/8/jre/lib":[],"/lt/8/lib/accessibility.properties":[],"/lt/8/lib/fonts/LucidaSansRegular.ttf":[],"/lt/8/lib/currency.data":[0,131072],"/lt/8/lib/currency.properties":[],"/lt/libraries/libGLESv2.so.1":[0,262144],"/lt/libraries/libEGL.so.1":[0,262144],"/lt/8/lib/fonts/badfonts.txt":[],"/lt/8/lib/fonts":[],"/lt/etc/hosts":[],"/lt/etc/resolv.conf":[0,131072],"/lt/8/lib/fonts/fallback":[],"/lt/fc/fonts/fonts.conf":[0,131072],"/lt/fc/ttf":[],"/lt/fc/cache/e21edda6a7db77f35ca341e0c3cb2a22-le32d8.cache-7":[0,131072],"/lt/fc/ttf/LiberationSans-Regular.ttf":[0,131072,262144,393216],"/lt/8/lib/jaxp.properties":[],"/lt/etc/timezone":[],"/lt/8/lib/tzdb.dat":[0,131072]}
    });
    progress.value = 2;
    if (initStatus) initStatus.textContent = 'Launching Minecraft...';
    const mc = new MinecraftClient(jarSource, undefined, progress);
    await mc.run();
    progress.value = 4;
    if (initStatus) { initStatus.textContent = 'Ready'; setTimeout(()=>{initStatus.style.display='none';}, 1000); }
    setTimeout(() => { progress.style.display = 'none'; }, 1000);
  } catch (err) {
    progress.style.display = 'none';
    if (initStatus) initStatus.style.display = 'none';
    console.error(err);
  }
});
			modUpload.addEventListener('change', async (e) => {
				try {
					const files = Array.from(e.target.files);
					if (!files.length) {
						return;
					}
					files.forEach(file => {
						if (!uploadedMods.some(f => f.name === file.name)) {
							if (versionType === 'jar' && !file.name.endsWith('.jar')) return;
							if (versionType === 'zip' && !file.name.endsWith('.zip')) return;
							if (versionType === 'jar-zip' && !(file.name.endsWith('.zip') || file.name.endsWith('.jar'))) return;
							uploadedMods.push(file);
						}
					});
					updateModList();
				} catch (err) {
					console.error(err);
				}
			});
				const AETHER_URL = '/demo/aether.zip';
				const PLAYER_API_URL = '/demo/player-api.zip';
				const loadAetherBtn = document.getElementById('load-aether-demo-btn');
				const aetherStatus = document.getElementById('aether-demo-status');
				loadAetherBtn.addEventListener('click', async () => {
				  try {
				    loadAetherBtn.disabled = true;
				    aetherStatus.style.display = '';
				    aetherStatus.textContent = 'Loading Aether demo...';
				    progress.style.display = '';
				    progress.value = 0;
				    progress.max = 3;
				    const urls = [
				      {url: AETHER_URL, name: 'The Aether Mod.zip'},
				      {url: PLAYER_API_URL, name: 'MC Player API.zip'}
				    ];
				    for (let i = 0; i < urls.length; i++) {
				      const entry = urls[i];
				      aetherStatus.textContent = `Fetching ${entry.name}...`;
				      const resp = await fetch(entry.url);
				      if (!resp.ok) throw new Error('Failed to fetch ' + entry.url);
				      const blob = await resp.blob();
				      blob.name = entry.name;
				      if (!uploadedMods.some(m => m.name === blob.name)) {
				        uploadedMods.push(blob);
				      }
				      progress.value = i + 1;
				    }
				    updateModList();
				    aetherStatus.textContent = 'Starting demo...';
				    if (versionType !== 'zip') {
				      for (let i = 0; i < versionSelect.options.length; i++) {
				        if (versionSelect.options[i].dataset.type === 'zip') {
				          versionSelect.selectedIndex = i;
				          versionSelect.dispatchEvent(new Event('change'));
				          break;
				        }
				      }
				    }
				    playBtn.click();
				  } catch (err) {
				    console.error(err);
				    aetherStatus.textContent = 'Demo load failed: ' + (err.message || err);
				    loadAetherBtn.disabled = false;
				    setTimeout(()=>{aetherStatus.style.display='none';},5000);
				  }
				});
			async function patchJarWithMods() {
  try {
    if (versionType === 'jar') {
      return null;
    }
    if (versionType === 'zip' || versionType === 'jar-zip') {
      const zipMods = uploadedMods.filter(f => f.name.endsWith('.zip'));
      if (zipMods.length === 0) {
        progress.style.display = 'none';
        return null;
      }
      progress.style.display = '';
      progress.value = 0;
      let totalFiles = 0;
      for (const file of zipMods) {
        try {
          const modZip = await JSZip.loadAsync(file);
          totalFiles += Object.keys(modZip.files).filter(fname => !modZip.files[fname].dir).length;
        } catch {}
      }
      progress.max = totalFiles + 2; 
      const versionJarPath = versionSelect.value;
      let jarResp;
      try {
        jarResp = await fetch(versionJarPath);
        if (!jarResp.ok) throw new Error('Failed to fetch base jar: ' + jarResp.statusText);
      } catch (err) {
        progress.style.display = 'none';
        throw err;
      }
      let jarBuf;
      try {
        jarBuf = await jarResp.arrayBuffer();
      } catch (err) {
        progress.style.display = 'none';
        throw err;
      }
      progress.value++;
      const zip = new JSZip();
      try {
        await zip.loadAsync(jarBuf);
      } catch (err) {
        progress.style.display = 'none';
        throw err;
      }
      let doneFiles = 0;
      for (const [i, file] of zipMods.entries()) {
        let modZip;
        try {
          modZip = await JSZip.loadAsync(file);
        } catch (err) {
          continue;
        }
        const modFileNames = Object.keys(modZip.files).filter(fname => !modZip.files[fname].dir);
        for (const fname of modFileNames) {
          try {
            const content = await modZip.files[fname].async('uint8array');
            zip.file(fname, content);
            doneFiles++;
            progress.value = 1 + doneFiles;
          } catch (err) {}
        }
      }
      progress.value = totalFiles + 1;
      let newJarBuf;
      try {
        newJarBuf = await zip.generateAsync({type: 'uint8array'});
      } catch (err) {
        progress.style.display = 'none';
        throw err;
      }
      progress.value = progress.max;
      setTimeout(() => { progress.style.display = 'none'; }, 1000);
      return new Blob([newJarBuf], {type: 'application/java-archive'});
    }
    return null;
  } catch (err) {
    progress.style.display = 'none';
    throw err;
  }
}