import { CircularProgress, Container, Grid, Paper, Slider, Typography, makeStyles, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import BootcampCard from "../components/BootcampCard"
import { useState } from "react";
import { useNavigate } from "react-router-dom"
// How to setup proxy to Work
// 1) add "proxy":"http://127.0.0.1:3001" in frontend and backend package.json
// 2) set DANGEROUSLY_DISABLE_HOST_CHECK=true
// 3) use npm start

const useStyles = makeStyles({
  root: {
    marginTop: 20,
  },
  loader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paper: {
    marginBottom: "1rem",
    padding: "13px"
  },
  filters: {
    padding: "0 1.5rem"
  },
  priceRangeInputs: {
    display: "flex",
    justifyContent: "space-between"
  }
})

const BootcampPage = () => {

  const navigate = useNavigate()

  // mui classes
  const classes = useStyles();

  const [sliderMax, setSliderMax] = useState(1000);
  const [priceRange, setPriceRange] = useState([25, 75]);
  const [filter, setFilter] = useState("");

  const { data, isLoading, refetch } = useQuery(["bootcamp"], async () => {
    const res = await Axios.get("/api/v1/bootcamps");
    return res.data;
  });

  let bootcamps = data?.data;

  const onSliderCommitHandler = (e, newValue) => {
    const urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`
    // setFilter(urlFilter);
    // navigate(urlFilter)
    console.log(urlFilter)
    refetch()
  }

  const buildRangeFilter = (newValue) => {
    const urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`
    // setFilter(urlFilter);
    // console.log(filter)
    navigate(urlFilter);
  }

  return (
    <Container className={classes.root}>
      {/* Fitering and sorting */}
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Filters</Typography>
            <div className={classes.filters}>
              <Slider 
                min={0}
                max={sliderMax}
                value={priceRange}
                valueLabelDisplay="auto"
                onChange={(e, newValue) => setPriceRange(newValue)}
                onChangeCommitted={onSliderCommitHandler}
              />
              <div className={classes.priceRangeInputs}>
                <TextField 
                  size="small"
                  id="lower"
                  label="Min. Price"
                  variant="outlined"
                  type="number"
                  disabled={isLoading}
                  value={0}
                />
                <TextField 
                  size="small"
                  id="upper"
                  label="Max. Price"
                  variant="outlined"
                  type="number"
                  disabled={isLoading}
                  value={75}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Sort By</Typography>
            <FormControl component={"fieldset"} className={classes.filters}>
              <RadioGroup
                aria-label="price-order"
                name="price-order">
                <FormControlLabel 
                  disabled={isLoading}
                  control={<Radio />}
                  label="Price: Highest - Lowest"
                />
                <FormControlLabel 
                  disabled={isLoading}
                  control={<Radio />}
                  label="Price: Lowest - Highest"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bootcamps Listing */}
      <Grid container spacing={2}>
        {isLoading ? (
          <div className={classes.loader}>
            <CircularProgress size="3rem" thickness={5}/>
          </div>
        ) : (
          bootcamps.map((bootcamp) => {
            return (            
              <Grid item key={bootcamp._id} xs={12} sm={6} md={4} lg={3}>
                <BootcampCard bootcamp={bootcamp} />
              </Grid>
            )
          })
        )}
      </Grid>
    </Container>
  )
}

export default BootcampPage;