import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useSelector } from "react-redux";
import { Drawer } from 'antd';
import { ProductSizes } from "../../util/Constant";

const ShopFilter = ({ price, setPrice, setPriceChanged, categoryFilter, setCategoryFilter }) => {


  const { totalSearchProducts } = useSelector((state) => state.productsState);
  const [filterObj, setFilterObj] = useState({});

  //for get the category value of showing products
  let category = [];

  if (totalSearchProducts) {
    totalSearchProducts.map((prodcuts) => category.push(prodcuts.category))
    category = new Set(category)
    category = Array.from(category)
  }


  //check the check box is on or not 
  let categoryURL = [];

  const handleChange = event => {

    if (event.target.checked) {

      categoryURL.push(event.target.value);
    }
    else {
      categoryURL = categoryURL.filter((x) => x !== event.target.value)
    }

  };

  //apply button
  const handleSumbit = (e) => {

    e.preventDefault()
    setPriceChanged(price)
    setCategoryFilter(categoryURL)

  }
  categoryURL = [...categoryFilter]


  /// for drawer
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const applyFilter = (name, val) => {
    console.log("value", val)
    const reqObj = filterObj;
    if (name === 'InStock') {
      reqObj[name] = { "$gt": 0 }
    }
    if (name === 'OutStock') {
      reqObj[name] = 0
    }
    if (name === 'price') {
      reqObj[name] = { min: val[0], max: val[1] }
    }
    else {
      reqObj[name] = val;
    }

    setFilterObj(reqObj);

    console.log("coming", reqObj)
  }




  return (
    <>

      {/* filter - heading */}
      <div className="hidden border lg:flex items-center font-semibold h-auto p-3 text-base   bg-white   z-10">
        <FaFilter />
        <p>Filters</p>
      </div>
      {/* filter - content */}
      <form onSubmit={handleSumbit}>

        <div className="hidden lg:block">
          <div className="flex justify-between items-center border p-3 font-semibold">
            <p>Applied Filters</p>
            <p className="underline text-sm">clear all</p>
          </div>

          {/* categories */}
          <Accordion disableGutters >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="font-bold">Category</h2>
            </AccordionSummary>
            <AccordionDetails>

              {category.map((category) => (
                <div className="my-1" key={category}>
                  <input onClick={() => applyFilter("category", category)} id={category} value={category || ''} className="w-4 h-4 accent-rose-500" onChange={handleChange} type="checkbox"
                    defaultChecked={categoryFilter.includes(category)} />
                  <label htmlFor={category} className="ml-3">{category}</label>
                </div>
              ))}




            </AccordionDetails>
          </Accordion>

          {/* stock */}
          <Accordion disableGutters >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="font-bold">Stock Status</h2>
            </AccordionSummary>

            <AccordionDetails>
              <div className="my-1">
                <input className="w-4 h-4 accent-rose-500" type="checkbox" onClick={() => applyFilter("InStock", 0)} />
                <label className="ml-3">In Stock</label>
              </div>
              <div className="my-1">
                <input className="w-4 h-4 accent-rose-500" type="checkbox" onClick={() => applyFilter("OutStock", 0)} />
                <label className="ml-3">Out of Stock</label>
              </div>
            </AccordionDetails>

          </Accordion>

          {/* price */}
          <Accordion disableGutters >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="font-bold">price</h2>
            </AccordionSummary>

            <AccordionDetails>
              <div className="my-1" >
                <p>{`${price[0]} to ${price[1]}`}</p>
                <Slider
                  onChangeComplete={(e) => applyFilter("price", e)}
                  range={true}

                  min={0}
                  max={10000}
                  defaultValue={price}
                  onChange={(x) => { setPrice(x) }}
                />

              </div>
            </AccordionDetails>
          </Accordion>

          {/* Size */}
          <Accordion disableGutters >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="font-bold">Size</h2>
            </AccordionSummary>
            <AccordionDetails>
              {
                ProductSizes.map((val, index) => {
                  return <div className="my-1">
                    <input className="w-4 h-4 accent-rose-500" type="checkbox" onClick={() => applyFilter("InStock", 0)} />
                    <label className="ml-3">{val}</label>
                  </div>
                })
              }
            </AccordionDetails>
          </Accordion>

          {/* Discount */}
          <Accordion disableGutters >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="font-bold">Discount</h2>
            </AccordionSummary>
            <AccordionDetails>
            </AccordionDetails>
          </Accordion>

          {/* Color */}
          <Accordion disableGutters >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2 className="font-bold">Color</h2>
            </AccordionSummary>
            <AccordionDetails>
            </AccordionDetails>
          </Accordion>

        </div>
        <button className="hidden lg:block" type="submit">apply</button>
      </form>










      {/*RES filter - heading */}
      <div onClick={showDrawer} className="lg:hidden border-2 flex items-center font-semibold h-12 md:h-16  p-2 md:p-3 text-sm md:text-base fixed bottom-0 left-0  bg-white  w-1/2  justify-center z-10">
        <FaFilter />
        <p>Filters</p>
      </div>

      <Drawer title={false} closable={false} placement="bottom" height={window.innerHeight} open={open}>
        {/* header */}
        <div className="flex items-center justify-between px-5 border text-sm  ">
          <p className="py-4 font-bold">FILTERS</p>
          <p className="py-4 text-rose-500 font-medium">CLEAR ALL</p>
        </div>

        {/* body */}


        {/* footer */}
        <div className="flex items-center justify-center absolute bottom-0 w-full border font-medium shadow-md">
          <p onClick={() => { setOpen(false) }} className="flex items-center justify-center w-full py-4 text-gray-500">CLOSE</p>
          <p className="flex items-center justify-center w-full py-4 text-rose-500">APPLY</p>
        </div>
      </Drawer>












    </>
  );
};

export default ShopFilter;
