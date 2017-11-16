
let fileSelector = document.getElementById('file-selector');
//Store buttons
let createFileButton = document.getElementById('create-button');
let deleteFileButton = document.getElementById('delete-button');
let saveButton = document.getElementById('save-button');
//Store input area
let inputArea = document.getElementById('input-area');
let currentText = localStorage.getItem('text') || '';
//Store display elements
let fileNameDisplay = document.getElementById('file-name-display');
let fileManager = new FileManager(JSON.parse(localStorage.getItem('fileManager')));

function save() {
	currentText = inputArea.value;
	localStorage.setItem('text', currentText);
}



function FileManager(data) {
	this.fileNames = [];
	this.fileObjects = [];
	this.activeFile;

	this.saveFileManager = function() {
		localStorage.setItem('fileManager', JSON.stringify(this));
	}

	this.createFile = function() {
		let fileName = prompt('File name?');
		fileNameDisplay.innerHTML = fileName;
		let newFile = new File(fileName);
		this.fileNames.push(fileName);
		this.activeFile = newFile;
	};

	this.deleteFile = function() {
		//Remove from arrays
		let index = this.fileNames.indexOf(this.activeFile.fileName);
		this.fileNames.splice(index,1);
		this.fileObjects.splice(index,1);
		//Remove key
		localStorage.removeItem(this.activeFile.fileName);

		//Set active file to current 0th index
		this.changeActiveFile(this.fileNames[0]);
	}

	this.changeActiveFile = function(fileName) {
		console.log(this.activeFile);
		console.log(fileName);
		this.activeFile = this.fileObjects.find(file => file.fileName === fileName);
		console.log(this.activeFile);
		inputArea.value = this.activeFile.fileContent;
		fileSelector.selectedIndex = this.fileNames.indexOf(fileName);
		this.saveFileManager();
	}

	this.saveActiveFile = function() {
		this.activeFile.updateContent(inputArea.value);
		this.activeFile.saveFile();
		this.saveFileManager();
	}

	//Handle restoring data to file manager
	if (data !== null)
	{
		if (data['fileNames'].length)
		{
			//if it has length, restore it
			this.fileNames = data['fileNames'];
			//Now restore the content
			for (var i = 0; i < this.fileNames.length; i++) {
				this.fileObjects.push(
				new File(this.fileNames[i],localStorage.getItem(this.fileNames[i])));
			}

			//Change to previously active file
			this.changeActiveFile(data['activeFile'].fileName);
		}
		// console.log(data['activeFile'].fileName);
		//Add files to file selector
		fileSelector.innerHTML = this.fileNames
    		.map(fileName => `<option value="${fileName}">${fileName}</option>`).join('');

    	this.changeActiveFile(this.activeFile.fileName);
	}
}

function File(fileName, fileContent) {
	this.fileName = fileName;
	this.fileContent = fileContent;

	this.updateContent = function(content){
		this.fileContent = content;
	}

	this.saveFile = function() {
		localStorage.setItem(this.fileName, this.fileContent);
	}
}

fileSelector.addEventListener('change', function() {
	fileManager.changeActiveFile(this.value);
});
deleteFileButton.addEventListener('click', fileManager.deleteFile.bind(fileManager));
createFileButton.addEventListener('click', fileManager.createFile.bind(fileManager));
saveButton.addEventListener('click', fileManager.saveActiveFile.bind(fileManager));


