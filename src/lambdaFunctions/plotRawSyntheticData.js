import { InvokeEndpointCommand, SageMakerRuntimeClient } from "@aws-sdk/client-sagemaker-runtime";
import axios from "axios"
import Plotly from "plotly";

const client = new SageMakerRuntimeClient({region: "us-east-1"});

const STUDENT_ID = "M00800419";
const URL = `https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/${STUDENT_ID}`;

const PLOTLY_USERNAME = 'Rockthegamer419';
const PLOTLY_KEY = "fEbqq9YDhFmosaPJ1gX7";

const plotly = Plotly(PLOTLY_USERNAME, PLOTLY_KEY);

export const handler = async (event) => {
    try {
        
        const results = await getPredictedData();

        let originalYValues = (await axios.get(URL)).data.target;

        let originalXValues = [];
        for(let i = 0; i < originalYValues.length; i++) {
            originalXValues.push(i);
        }

        let meanYValues = results.predictions[0].mean
        let meanXValues = [];
        for(let i=originalYValues.length; i<(originalYValues.length + meanYValues.length); i++){
            meanXValues.push(i);
        }
     
        let oneQuantileX = []
        let oneQuantileY = results.predictions[0].quantiles["0.1"];

        let nineQuantileX = []
        let nineQuantileY = results.predictions[0].quantiles["0.9"];

        for(let i=originalYValues.length; i<(originalYValues.length + oneQuantileY.length); i++){
            oneQuantileX.push(i);
        }

        for(let i=originalYValues.length; i<(originalYValues.length + nineQuantileY.length); i++){
            nineQuantileX.push(i);
        }

        let plotResult = await plotData({
            mean: {x: meanXValues, y: meanYValues},
            oneQuantile: {x: oneQuantileX, y: oneQuantileY},
            nineQuantile: {x: nineQuantileX, y: nineQuantileY},
            original: {x: originalXValues, y: originalYValues}
        });
        console.log("Plot for predicted synthetic data'" + "' available at: " + plotResult.url);

        return {
            statusCode: 200,
            body: "Ok"
        };

    } catch (error) {
        console.error("An error occurred: "+ error)
        return {
            statusCode: 500,
            body: "Error plotting predicted synthetic data"
        }
    }
}

// Method to plot data and return result url
async function plotData({
    mean: { x: meanX, y: meanY },
    original: { x: originalX, y: originalY },
    oneQuantile: { x: oneQuantileX, y: oneQuantileY },
    nineQuantile: { x: nineQuantileX, y: nineQuantileY }
}){

    let trace1 = {
        x: originalX,
        y: originalY,
        type: "scatter",
        mode: 'line',
        name: "Original",
        marker: {
            color: 'rgb(219, 64, 82)',
            size: 12
        }
    };
    
    let trace2 = {
        x: meanX,
        y: meanY,
        type: "scatter",
        mode: 'line',
        name: "Mean",
        marker: {
            color: 'rgba(39, 245, 39, 0.8)',
            size: 12
        }
    };
    
    let trace3 = {
        x: oneQuantileX,
        y: oneQuantileY,
        type: "scatter",
        mode: 'line',
        name: "Prediction 0.1 Quantile",
        marker: {
            color: 'rgba(223, 245, 39, 1)',
            size: 12
        }
    };
    
    let trace4 = {
        x: nineQuantileX,
        y: nineQuantileY,
        type: "scatter",
        mode: 'line',
        name: "Prediction 0.9 Quantile",
        marker: {
            color: 'rgba(39, 69, 245, 0.82)',
            size: 12
        }
    };
  
    
    let data = [trace1, trace2, trace3, trace4];

    //Layout of graph
    let layout = {
        title: "Predicted Synthetic Data",
        font: {
            size: 25
        },
        xaxis: {
            title: 'Time (hours)'
        },
        yaxis: {
            title: 'Value'
        }
    };
    let graphOptions = {
        layout: layout,
        filename: "predicted-synthetic-data",
        fileopt: "overwrite"
    };


    return new Promise ( (resolve, reject)=> {
        plotly.plot(data, graphOptions, function (err, msg) {
            if (err)
                reject(err);
            else {
                resolve(msg);
            }
        });
    });
}

const endpointData = {
"instances":
[
  {
    "start":"2024-04-06 21:00:00",
    "target": [325.4804446949458,318.24863986567914,314.5309845735867,324.81408294738276,306.0465749242591,319.14789208211494,317.44829958700564,345.79392257303795,333.7912220866806,328.5135810881919,357.9093099257985,359.40192132034724,371.0191764624696,369.09875234215815,385.029740881569,360.52424387574246,378.9485459655605,360.3848100037445,365.6736179609313,361.44102642494994,367.4485352602252,339.3434480393565,343.9443528529285,356.41345424450026,334.54492443676446,339.8065113818567,322.9378893560477,335.878274646698,332.7088393918468,335.26574572336426,327.51107059457985,340.1580545679973,347.49929171832406,368.5110055972035,360.6730526743153,356.1758281855881,357.75225451616,383.89515263782056,386.2877660038143,384.72502508864403,392.24511012760445,383.26582628575034,382.6323746273328,378.5797781580212,360.03781637960054,356.2723308609704,356.12959098044945,352.52580309679973,337.6520227705929,341.6997343443588,337.32384290551374,343.5131932460744,340.6245444326707,354.5917133170964,365.0547382865276,367.1928912043116,351.7495881022026,376.88691877297356,393.2073878769549,367.77675040950953,370.30204350741997,373.48871947476516,392.98952166858385,381.47492671917087,414.84437005490395,379.2462873179313,392.8379233479637,396.5312028709656,370.1496366194519,366.7562624560572,366.3857985782273,373.0262754645295,379.3184876369386,348.5227878463919,369.93104669021767,370.86623217952734,345.75613868734337,360.0326450276751,376.4291302345549,353.54852081010665,360.7725304964894,372.1019012070779,397.87545258384205,399.10728870088946,381.7566162044645,399.8781618175843,424.3574397563764,400.0718536705101,424.4070107482927,402.30886256178724,402.81576665543986,384.99786158459176,381.1732528576818,372.5857378455226,376.2311842646617,388.6388830118816,392.2708682141704,357.27189445735434,361.62842467535745,381.9436353868825,367.09462278670196]
  }
],
"configuration":
   {
     "num_samples": 50,
      "output_types":["mean","quantiles","samples"],
      "quantiles":["0.1","0.9"]
   }
};

async function getPredictedData () {
    const command = new InvokeEndpointCommand({
        EndpointName: "SyntheticDataPredictionEndPoint1",
        Body: JSON.stringify(endpointData),
        ContentType: "application/json",
        Accept: "application/json"
    });
    
   
    const response = await client.send(command);

    // Parse the response body from binary format to a string, then to a JavaScript object
    let predictions = JSON.parse(Buffer.from(response.Body).toString('utf8'));
   
    return predictions;
}

handler({})

// Link to the graph: https://chart-studio.plotly.com/~Rockthegamer419/0/synthetic-data-for-student-dev-limbachia-m00800419/#plot