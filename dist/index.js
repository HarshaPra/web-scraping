import axios from "axios";
axios.get('https://www.autoevolution.com/cars/')
    .then(response => {
    console.log(response.data);
})
    .catch(error => {
    console.error('Error fetching data:', error);
});
