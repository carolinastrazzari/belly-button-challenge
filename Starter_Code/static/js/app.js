const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to fetch dropdown menu data and populate it
function dropdownmenu() {
    d3.json(url).then(function(data) {
        console.log(data);
        let selector = d3.select("#selDataset");
        let sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Call demotable and bubblechart with the first sample as default
        demotable(sampleNames[0]);
        bubblechart(sampleNames[0]);
    });
}

// Function to update data when a new sample is selected
function optionChanged(x) {
    demotable(x);
    bubblechart(x);
}

// Function to display sample metadata
function demotable(x) {
    d3.json(url).then(function(data) {
        console.log(data);
        let samplemetadata = data.metadata;
        let selectedMetadata = samplemetadata.filter(metadata => metadata.id == x)[0];
        MetaData(selectedMetadata);

        let selectedSample = data.samples.filter(sample => sample.id == x)[0];
        BarChart(selectedSample);
    });
}

// Function to display bubble chart
function bubblechart(x) {
    d3.json(url).then(function(data) {
        console.log(data);
        let sampledata = data.samples;
        let newArray = sampledata.filter(number => number.id == x)[0];
        otu_ids = newArray.otu_ids;
        sample_values = newArray.sample_values;
        otu_labels = newArray.otu_labels;

        let bubledata = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }
        }];

        let bubblelayout = {
            title: 'Bubble Chart',
            showlegend: false,
        };

        Plotly.newPlot('bubble', bubledata, bubblelayout);
    });
}

// Function to display bar chart
function BarChart(selectedSample) {
    let barData = [{
        x: selectedSample.sample_values.slice(0, 10).reverse(),
        y: selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: selectedSample.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];

    let layout = {
        title: "Top Ten OTUs",
        xaxis: { title: "Count of OTUs" }
    };

    Plotly.newPlot("bar", barData, layout);
}

// Function to display metadata
function MetaData(selectedMetadata) {
    console.log("Selected Metadata:", selectedMetadata); 

    let sampleSelect = d3.select("#sample-metadata");
    let metadataHTML = '';

    for (let property in selectedMetadata) {
        metadataHTML += `<div>${property}: ${selectedMetadata[property]}</div>`;
        console.log(`${property}: ${selectedMetadata[property]}`);
    }

    sampleSelect.html(metadataHTML);
}

// Initialize dropdown menu
dropdownmenu();


