import { 
  CircularProgress, 
  Container, 
  Grid, Paper, 
  Slider, 
  Typography, 
  makeStyles, 
  TextField, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button
} from "@material-ui/core";
import Axios from "axios";
import BootcampCard from "../components/BootcampCard"
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"

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
  const location = useLocation()
  const params = location.search ? location.search : null

  // mui classes
  const classes = useStyles();

  const [sliderMax, setSliderMax] = useState(1100);
  const [priceRange, setPriceRange] = useState([25, 75]);
  const [filter, setFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState("descending");
  const [sorting, setSorting] = useState("");
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(false);

  const UpdateUiValues = (values) => {
    setSliderMax(values.maxPrice);

    if (values.filter.price) {
      let priceFilter = values.filtering.price;
      setPriceRange([Number(priceFilter.gte), Number(priceFilter.lte)])

      if (values.sorting.price) {
        let priceSort = values.sorting.price;
        setPriceOrder(priceSort);
      }
    }
  }

  useEffect(() => {
    let cancel;
    let query;

    if (params && !filter) {
      query = params;
    } else {
      query = filter;
    }

    if (sorting) {
      if(query.length === 0) {
        query = `?sort=${sorting}`
      } else {
        query = query + "&sort="+ sorting
      }
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        
        const { data } = await Axios({
          method: "GET",
          url: `/api/v1/bootcamps${query}`,
          cancelToken: new Axios.CancelToken((c) => cancel = c)
        });

        setBootcamps(data?.data);
        setLoading(false);
        UpdateUiValues(data?.uiValues)
      } catch (error) {
        if (Axios.isCancel(error)) return;
        console.log(error.response);
      }
    }

    fetchData()

    return () => cancel();
  }, [filter, params, sorting])

  const handleInputChange = (e, type) => {
    let newRange;
    if (type === "lower") {
      newRange = [...priceRange];
      newRange[0] = Number(e.target.value);
      setPriceRange(newRange)
    }

    if (type === "upper") {
      newRange = [...priceRange];
      newRange[1] = Number(e.target.value);
      setPriceRange(newRange)
    }
  }

  const onSliderCommitHandler = (e, newValue) => {
    buildRangeFilter(newValue)
  }

  const onTextfieldCommitHandler = () => {
    buildRangeFilter(priceRange);
  }

  const buildRangeFilter = (newValue) => {
    const urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`
    setFilter(urlFilter);
    navigate(urlFilter);
  }

  const handleSortChange = (e) => {
    setPriceOrder(e.target.value);

    if (e.target.value === "ascending"){
      setSorting("price");
    }  else {
      setSorting("-price")
    }
  }

  const clearAllFilters = () => {
    setFilter("");
    setSorting("");
    setPriceRange([0, sliderMax]);
    navigate("/");
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
                disabled={loading}
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
                  disabled={loading}
                  value={priceRange[0]}
                  onChange={(e) => handleInputChange(e, "lower")}
                  onBlur={onTextfieldCommitHandler}
                />
                <TextField 
                  size="small"
                  id="upper"
                  label="Max. Price"
                  variant="outlined"
                  type="number"
                  disabled={loading}
                  value={priceRange[1]}
                  onChange={(e) => handleInputChange(e, "upper")}
                  onBlur={onTextfieldCommitHandler}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Sort By</Typography>
            <FormControl component={"fieldset"} className={classes.filters}>
              <RadioGroup
                aria-label="price-order"
                name="price-order"
                value={priceOrder}
                onChange={handleSortChange}>
                <FormControlLabel 
                value={"descending"}
                  disabled={loading}
                  control={<Radio />}
                  label="Price: Highest - Lowest"
                />
                <FormControlLabel 
                value={"ascending"}
                  disabled={loading}
                  control={<Radio />}
                  label="Price: Lowest - Highest"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Button size="small" color="primary" onClick={clearAllFilters}>Clear All</Button>
      </Paper>

      {/* Bootcamps Listing */}
      <Grid container spacing={2}>
        {loading ? (
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