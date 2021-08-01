const config = {
    target: document.getElementById("target"),
    url: "https://api.recursionist.io/builder/computers?type=",
    pcNum: 0,
    pcBenchmark: {
        cpu: 0,
        gpu: 0,
        ram: 0,
        storage: 0,
    },
}

//見た目作成
function createPage(){
    let htmlString = 
    `
        <div class="bg-dark text-white text-center p-2">
            <h1>Build Your Own PC</h1>
        </div>
        <div class="mt-3 col-12">
            <div class="mb-4">
                <h5>step 1: Select your CPU</h5>
                <div class="d-flex mt-3">
                    <p class="mr-2">Brand</p>
                    <select id="cpuBrand" class="form-select col-3 mr-3">
                    </select>
                    <p class="mr-2">Model</p>
                    <select id="cpuModel" class="form-select col-3">
                        <option value="-">-</option>
                    </select>
                </div>
            </div>
            <div class="mb-4">
                <h5>step 2: Select your GPU</h5>
                <div class="d-flex mt-3">
                    <p class="mr-2">Brand</p>
                    <select id="gpuBrand" class="form-select col-3 mr-3">
                    </select>
                    <p class="mr-2">Model</p>
                    <select id="gpuModel" class="form-select col-3">
                        <option value="-">-</option>
                    </select>
                </div>
            </div>
            <div class="mb-4">
                <h5>step 3: Select your memory card</h5>
                <div class="d-flex mt-3">
                    <p class="mr-2">How many?</p>
                    <input id="ramSlot" type="number" min="1" max="4" placeholder="1" class="mr-3" onchange='createBrand("ram", "ramBrand"); removeMenu(["ramModel"])'>
                    <p class="mr-2">Brand</p>
                    <select id="ramBrand" class="form-select col-3 mr-3">
                        <option value="-">-<option>
                    </select>
                    <p class="mr-2">Model</p>
                    <select id="ramModel" class="form-select col-3">
                        <option value="-">-</option>
                    </select>
                </div>
            </div>
            <div class="mb-5">
                <h5>step 4: Select your storage</h5>
                <div class="d-flex flex-wrap mt-3">
                    <p class="mr-2">HDD or SSD</p>
                    <select id="disk" class="form-select col-2 mr-3" onchange='removeMenu(["storage", "storageBrand", "storageModel"])'>
                        <option value="-">-</option>
                        <option value="hdd">HDD</option>
                        <option value="ssd">SSD</option>
                    </select>
                    <p class="mr-2">storage</p>
                    <select id="storage" class="form-select col-2 mr-3" onchange='createBrand(document.getElementById("disk").value, "storageBrand")'>
                        <option value="-">-</option>
                    </select>
                    <p class="mr-2">Brand</p>
                    <select id="storageBrand" class="form-select col-2 mr-3">
                        <option value="-">-<option>
                    </select>
                    <p class="mr-2">Model</p>
                    <select id="storageModel" class="form-select col-2">
                        <option value="-">-<option>
                    </select>
                </div>
            </div>
            <div>
                <button type="button" class="btn btn-primary btn-lg col-4">Go!</button>
            </div>
        </div>
        <div id="pcResult" class="mt-4">
        </div>
    `
    config.target.innerHTML = htmlString;
}

createPage()

//ブランドメニュー作成
function createBrand(type, id){
    let options = `<option value="-">-</option>`;
    let hashmap = {}
    fetch(config.url + type).then(response=>response.json()).then(function(data){
        for (let item of data){
            let option = item["Brand"];
            if(hashmap[option] === undefined){
                hashmap[option] = 1;
                options += `<option value=${option}>${option}</option>`
            }
            else hashmap[option] += 1;
        }
        document.getElementById(id).innerHTML = options;
    })
}

//モデルメニュー作成（CPU & GPU用）
function createModel(type, value, id){
    let options = `<option value="-">-</option>`;
    fetch(config.url + type).then(response=>response.json()).then(function(data){
        for (let item of data){
            if(item["Brand"] === value){
                options += `<option value="${item["Model"]}">${item["Model"]}</option>`
            }
        }

        document.getElementById(id).innerHTML = options;
    })
}

//モデルメニュー作成（memory card用）
function createModelForRam(type, value, slot){
    let options = `<option value="-">-</option>`;
    fetch(config.url + type).then(response=>response.json()).then(function(data){
        for (let item of data){
            if(item["Brand"] === value && item["Model"].split(" ")[item["Model"].split(" ").length-1][0] == slot){
                options += `<option value="${item["Model"]}">${item["Model"]}</option>`
            }
        }

        document.getElementById("ramModel").innerHTML = options;
    })
}

function setStorage(type){
    let options = `<option value="-">-</option>`;
    let hashmap = {}
    fetch(config.url + type).then(response=>response.json()).then(function(data){
        for (let item of data){
            let storage = item["Model"].split(" ")[item["Model"].split(" ").length-1].length == 6 ? item["Model"].split(" ")[item["Model"].split(" ").length-2] : item["Model"].split(" ")[item["Model"].split(" ").length-1].indexOf(")") == -1 ? item["Model"].split(" ")[item["Model"].split(" ").length-1] : item["Model"].split(" ")[item["Model"].split(" ").length-4];
            if(hashmap[storage] === undefined){
                hashmap[storage] = 1;
                options += `<option value="${storage}">${storage}</option>`
            }
        }

        document.getElementById("storage").innerHTML = options;
    })
}

function createModelForDisk(brand, storage){
    let options = `<option value="-">-</option>`;
    fetch(config.url + document.getElementById("disk").value).then(response=>response.json()).then(function(data){
        for (let item of data){
            if(item["Brand"] == brand && item["Model"].indexOf(storage) != -1) options += `<option value="${item["Model"]}">${item["Model"]}</option>`
        }

        document.getElementById("storageModel").innerHTML = options;
    })
}

//メニューリセット
function removeMenu(idList){
    for (let i = 0; i < idList.length; i++){
        document.getElementById(idList[i]).innerHTML = `<optionvalue="-">-<option>`
    }
}


//PCを追加する
function addPc(){
    config.pcNum += 1;
    let parent = document.createElement("div");
    let htmlString = 
    `
        <div class="bg-info col-12 d-flex text-white text-center mt-2">
            <div class="col-6">
                <h1>PC${config.pcNum} Specs</h1>
            </div>
            <div class="col-6">
                <h6>Gaming : ${gameScore()}%</h6>
                <h6>Work : ${workScore()}%</h6>
            </div>
        </div>
    `
    
    parent.innerHTML = htmlString;
    return parent;
}


//gaming & workスコア計算
function gameScore(){
    let cpuBenchmark = config.pcBenchmark.cpu * .6;
    let gpuBenchmark = config.pcBenchmark.gpu * .25;
    let ramBenchmark = config.pcBenchmark.ram * .125;
    let storageBenchmark = document.getElementById("disk").value == "SSD" ? config.pcBenchmark.storage * .1: config.pcBenchmark.storage * .025;
    return Math.round(cpuBenchmark + gpuBenchmark + ramBenchmark + storageBenchmark);
}

function workScore(){
    let cpuBenchmark = config.pcBenchmark.cpu * .6;
    let gpuBenchmark = config.pcBenchmark.gpu * .25;
    let ramBenchmark = config.pcBenchmark.ram * .1;
    let storageBenchmark = config.pcBenchmark.storage * .05
    return Math.round(cpuBenchmark + gpuBenchmark + ramBenchmark + storageBenchmark);
}

createBrand("cpu", "cpuBrand");
createBrand("gpu", "gpuBrand");

document.getElementById("cpuBrand").addEventListener("change", function(event){
    createModel("cpu", event.target.value, "cpuModel");
})
document.getElementById("gpuBrand").addEventListener("change", function(event){
    createModel("gpu", event.target.value, "gpuModel");
})
document.getElementById("ramBrand").addEventListener("change", function(event){
    createModelForRam("ram", event.target.value, document.getElementById("ramSlot").value);
})
document.getElementById("disk").addEventListener("change", function(event){
    setStorage(event.target.value);
})
document.getElementById("storageBrand").addEventListener("change", function(event){
    createModelForDisk(event.target.value, document.getElementById("storage").value);
})

document.querySelectorAll(".btn")[0].addEventListener("click", function(){
    document.getElementById("pcResult").append(addPc());
})


//選択された各パーツのモデルのベンチマークをconfigに追加
let parts = Object.keys(config.pcBenchmark);
for (let i = 0; i < parts.length-1; i++){
    document.getElementById(parts[i] + "Model").addEventListener("change", e => {
        fetch(config.url + parts[i]).then(response=>response.json()).then(data=>{
            for (let item of data){
                if(item["Model"] == e.target.value) config.pcBenchmark[parts[i]] = item["Benchmark"];
            }
        })
    })
}

document.getElementById("storageModel").addEventListener("change", e => {
    let storageType = document.getElementById("disk").value;
    fetch(config.url + storageType).then(response=>response.json()).then(data => {
        for (let item of data){
            if(item["Model"] == e.target.value) config.pcBenchmark.storage = item["Benchmark"];
        }
    });
});