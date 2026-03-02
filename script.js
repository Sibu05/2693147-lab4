document.addEventListener("DOMContentLoaded", function () {

    const searchBtn = document.getElementById("search-btn");
    const txtInput = document.getElementById("country-input");
    const secInfo = document.getElementById("country-info");
    const secBorder = document.getElementById("bordering-countries");
    const loading = document.getElementById("loading-spinner");
    const errorBox = document.getElementById("error-message");

    async function searchCountry(countryName) {
        try {
            if (!countryName.trim()) {
                displayError("Please enter a country name.");
                return;
            }

            loading.style.display = "block";
            errorBox.textContent = "";
            secInfo.innerHTML = "";
            secBorder.innerHTML = "";


            const countryData = await fetchCountryData(countryName);
            updateCountryInfo(countryData);


            const neighbours = await fetchNbrData(countryData.borders || []);

            updateBorders(neighbours);

        } catch (error) {
            displayError(error.message || "Something went wrong.");
        } finally {
       
            loading.style.display = "none";
        }
    }

    async function fetchCountryData(country) {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);

        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        return data[0];
    }

    async function fetchNbrData(borderCodes) {
        if (!borderCodes.length) return [];

        const response = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${borderCodes}`
        );

        if (!response.ok) {
            throw new Error("Bordering countries not found.");
        }

        return await response.json();
    }

    function updateCountryInfo(countryData) {
        secInfo.innerHTML = `
            <h2>${countryData.name.common}</h2>
            <p><strong>Capital:</strong> ${countryData.capital ? countryData.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${countryData.region}</p>
            <img src="${countryData.flags.svg}" 
                 alt="${countryData.name.common} flag" 
                 width="150">
        `;
    }

    function updateBorders(neighbours) {
        if (neighbours.length === 0) {
            secBorder.innerHTML = `<p>No bordering countries.</p>`;
            return;
        }

        secBorder.innerHTML = `
            <h3>Bordering Countries</h3>
            <ul>
                ${neighbours.map(neighbour => `
                    <li>
                        <strong>${neighbour.name.common}</strong><br>
                        <img src="${neighbour.flags.svg}" 
                             alt="Flag of ${neighbour.name.common}" 
                             width="50">
                    </li>
                `).join("")}
            </ul>
        `;
    }

    function displayError(message) {
        errorBox.textContent = message;
        secInfo.innerHTML = "";
        secBorder.innerHTML = "";
    }

    searchBtn.addEventListener("click", function (event) {
        event.preventDefault();
        searchCountry(txtInput.value);
    });

    txtInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchCountry(txtInput.value);
        }
    });

});