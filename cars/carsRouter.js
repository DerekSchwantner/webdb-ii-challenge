const express = require("express");

const db = require("../data/db-config");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cars = await db("cars");
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve cars" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const car = await db("cars").where({ id: req.params.id });

    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve car" });
  }
});

router.post("/", validateCarInfo, async (req, res) => {
  try {
    const carData = req.body;
    const [id] = await db("cars").insert(carData);
    const newCarEntry = await db("cars").where({ id });

    res.status(201).json(newCarEntry);
  } catch (err) {
    console.log("POST error", err);
    res.status(500).json({ message: "Failed to store data" });
  }
});

router.put("/:id", validateCarInfo, async (req, res) => {
  const id = req.params.id;
  try {
    const updatedCarData = req.body;
    const carId = await db("cars").update(updatedCarData);
    const newCarEntry = await db("cars").where({ id: req.params.id });

    res.status(200).json(newCarEntry);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update car data" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedCar = await db("cars")
      .where({ id: req.params.id })
      .delete();
    res.status(200).json({ message: "Car has been deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete car data" });
  }
});

//Middleware

function validateCarInfo(req, res, next) {
  const carInfo = req.body;
  console.log("time to validate the car info");
  if (!carInfo.VIN || !carInfo.make || !carInfo.model || !carInfo.mileage) {
    res.status(400).json({ message: "missing car data" });
  } else {
    next();
  }
}

module.exports = router;
