const apiKey = "your_api_key"; // From Hugging Face

const surprisePrompts = [
    'girl standing on a foggy pavement while holding her purse, in the style of yigal ozeri, video, beach portraits, kaethe butcher, close up, michael malm',
    'the cover art of rood magazine has a sphere, a worm, and a glowing red light, in the style of conceptual portraiture, made of rubber, futuristic robots, elina karimova, light black, technology-based art',
    'photography, dynamic range, in the city, ollie motion with professional man skateboarder',
    'Create an artistic representation of the Garden of Eden from the Book of Genesis, capturing its lushness and tranquility'
];
function surpriseMe() {
    var prompt = Math.floor(Math.random() * surprisePrompts.length);
    document.getElementById('promptInput').value = surprisePrompts[prompt];
}


// disable generate function
function disableGenerateButton()
{
    document.getElementById("prompt-submit-btn").disabled = true;
}

// disable generate function after process
function enableGenerateButton()
{
    document.getElementById("prompt-submit-btn").disabled = false;
}

function getRandomNumber(min , max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// function to clear images grid
function clearImagesGrid()
{
    const imagesGrid = document.getElementById("result-grid").innerHTML = "";
}

// Function to generate the iamges
async function generateImages (input)
{
    disableGenerateButton();
    clearImagesGrid();
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    const imageUrls = [];

    for(let i = 0; i < 4 ; i ++)
    {
        const randomNumber = getRandomNumber(1, 100);
        const prompt = `${input} ${randomNumber}`;
        
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({inputs:prompt}),
            }
        );

        if(!response.ok)
        {
            alert('Failed to genrate image!');
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `image-${i + 1}`;
        img.onclick = ()=> downloadImage(imgUrl , i);
        document.getElementById("result-grid").appendChild(img);
    }

    loader.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // rest selected image
}
document.getElementById("prompt-submit-btn").addEventListener('click', () => {
    const input = document.getElementById("promptInput").value;
    generateImages(input);
});

function downloadImage(imgUrl , imageNumber)
{
    const link = document.createElement("a");
    link.href = imgUrl;
    // file name
    link.download = `ahmedAI-${imageNumber + 1}.jpg`;
    link.click();
}