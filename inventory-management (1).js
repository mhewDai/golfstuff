// Inventory Management System for Clothing Retail

// Define clothing manufacturers
const manufacturers = [
  {
    id: 1,
    name: "UrbanThreads",
    specialty: "Streetwear and casual apparel",
    leadTime: 45, // days
    minOrderQuantity: 100,
    returnPolicy: "Accepts returns of unsold inventory at 70% of original cost, once per year"
  },
  {
    id: 2,
    name: "ElegantEssentials",
    specialty: "Business and formal wear",
    leadTime: 60, // days
    minOrderQuantity: 50,
    returnPolicy: "Accepts returns of unsold inventory at 60% of original cost, twice per year"
  },
  {
    id: 3,
    name: "ActivePeak",
    specialty: "Athletic and performance wear",
    leadTime: 30, // days
    minOrderQuantity: 75,
    returnPolicy: "Accepts returns of unsold inventory at 50% of original cost, quarterly"
  },
  {
    id: 4,
    name: "SeasonalStyles",
    specialty: "Seasonal and trend-focused items",
    leadTime: 90, // days
    minOrderQuantity: 150,
    returnPolicy: "Accepts returns of unsold inventory at 40% of original cost, end of each season"
  }
];

// Define clothing categories, sizes, and colors
const categories = ["Tops", "Bottoms", "Outerwear", "Dresses", "Accessories"];
const sizes = {
  tops: ["XS", "S", "M", "L", "XL", "XXL"],
  bottoms: ["28", "30", "32", "34", "36", "38", "40", "42"],
  outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
  dresses: ["0", "2", "4", "6", "8", "10", "12", "14", "16"],
  accessories: ["One Size"]
};
const genders = ["Men", "Women", "Unisex"];
const colors = ["Black", "White", "Navy", "Gray", "Beige", "Red", "Green", "Blue", "Purple", "Pink"];

// Generate historical inventory and sales data with intentional size bias
class InventoryManagementSystem {
  constructor() {
    this.inventory = [];
    this.salesHistory = [];
    this.returnedInventory = [];
    this.purchaseOrders = [];
    this.currentYear = 2025;
    
    // Initialize with 3 years of historical data
    this.initializeHistoricalData(2022, 2024);
  }
  
  /**
   * Initializes historical inventory and sales data for specified years
   */
  initializeHistoricalData(startYear, endYear) {
    for (let year = startYear; year <= endYear; year++) {
      // Create inventory for the year
      this.generateYearlyInventory(year);
      
      // Simulate sales with size bias
      this.simulateSalesForYear(year);
      
      // Process returns to manufacturers at year end
      this.processYearEndReturns(year);
    }
    
    // Set up current year inventory
    this.generateYearlyInventory(this.currentYear);
  }
  
  /**
   * Generates inventory for a specific year with manufacturer distribution
   */
  generateYearlyInventory(year) {
    // Each manufacturer provides different products
    manufacturers.forEach(manufacturer => {
      // Determine number of products from this manufacturer
      const productCount = 10 + Math.floor(Math.random() * 15);
      
      for (let i = 0; i < productCount; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const availableSizes = sizes[category.toLowerCase()] || sizes.accessories;
        
        // Create a product
        const product = {
          id: `${year}-${manufacturer.id}-${i}`,
          name: `${color} ${manufacturer.name} ${category} for ${gender}`,
          manufacturer: manufacturer.id,
          category,
          gender,
          color,
          year,
          dateAdded: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        };
        
        // Add inventory for each size with intentional bias
        availableSizes.forEach(size => {
          // Create size bias for men's clothing (more S and M, fewer L and XL)
          let quantity = 20 + Math.floor(Math.random() * 30);
          
          if (gender === "Men") {
            if (size === "S" || size === "M" || size === "30" || size === "32") {
              // Overstock small and medium sizes
              quantity = 50 + Math.floor(Math.random() * 50);
            } else if (size === "L" || size === "XL" || size === "36" || size === "38") {
              // Understock larger sizes
              quantity = 5 + Math.floor(Math.random() * 15);
            }
          }
          
          this.inventory.push({
            ...product,
            size,
            initialQuantity: quantity,
            currentQuantity: quantity,
            price: 19.99 + Math.floor(Math.random() * 80)
          });
        });
      }
    });
  }
  
  /**
   * Simulates sales for a specific year with size bias
   */
  simulateSalesForYear(year) {
    // Filter inventory for the specific year
    const yearInventory = this.inventory.filter(item => item.year === year);
    
    // Simulate sales transactions throughout the year
    const salesTransactions = 1000;
    
    for (let i = 0; i < salesTransactions; i++) {
      // Randomly select an inventory item to sell, with bias toward certain sizes
      let availableItems = yearInventory.filter(item => item.currentQuantity > 0);
      
      if (availableItems.length === 0) continue;
      
      // Apply size preference bias in selection
      const selectedItem = this.selectItemWithSizeBias(availableItems);
      
      if (!selectedItem) continue;
      
      // Determine quantity sold in this transaction (1-3 items)
      const quantitySold = Math.min(
        Math.floor(Math.random() * 3) + 1,
        selectedItem.currentQuantity
      );
      
      // Record the sale
      const saleDate = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      this.salesHistory.push({
        productId: selectedItem.id,
        size: selectedItem.size,
        quantity: quantitySold,
        totalPrice: selectedItem.price * quantitySold,
        date: saleDate
      });
      
      // Update inventory
      selectedItem.currentQuantity -= quantitySold;
    }
  }
  
  /**
   * Selects an inventory item with bias toward certain sizes
   */
  selectItemWithSizeBias(availableItems) {
    // Group items by gender and size for biased selection
    const menItems = availableItems.filter(item => item.gender === "Men");
    const womenItems = availableItems.filter(item => item.gender === "Women");
    const unisexItems = availableItems.filter(item => item.gender === "Unisex");
    
    // Prepare groups by size
    const menLargeItems = menItems.filter(item => 
      item.size === "L" || item.size === "XL" || item.size === "XXL" ||
      item.size === "36" || item.size === "38" || item.size === "40" || item.size === "42"
    );
    
    const menSmallItems = menItems.filter(item => 
      item.size === "XS" || item.size === "S" || item.size === "M" ||
      item.size === "28" || item.size === "30" || item.size === "32" || item.size === "34"
    );
    
    // Apply selection probability
    const rand = Math.random();
    let selectionPool;
    
    if (rand < 0.15 && menLargeItems.length > 0) {
      // 15% chance to select from men's large sizes
      selectionPool = menLargeItems;
    } else if (rand < 0.50 && menSmallItems.length > 0) {
      // 35% chance to select from men's small/medium sizes
      selectionPool = menSmallItems;
    } else if (rand < 0.80 && womenItems.length > 0) {
      // 30% chance to select from women's items
      selectionPool = womenItems;
    } else if (unisexItems.length > 0) {
      // 20% chance to select from unisex items
      selectionPool = unisexItems;
    } else {
      // Fallback to any available item
      selectionPool = availableItems;
    }
    
    if (selectionPool.length === 0) return null;
    
    // Return a random item from the selected pool
    return selectionPool[Math.floor(Math.random() * selectionPool.length)];
  }
  
  /**
   * Processes year-end returns to manufacturers
   */
  processYearEndReturns(year) {
    // Group inventory by manufacturer
    const manufacturerInventory = {};
    
    manufacturers.forEach(manufacturer => {
      manufacturerInventory[manufacturer.id] = this.inventory.filter(
        item => item.year === year && item.manufacturer === manufacturer.id && item.currentQuantity > 0
      );
    });
    
    // Process returns for each manufacturer
    manufacturers.forEach(manufacturer => {
      const items = manufacturerInventory[manufacturer.id];
      
      if (!items || items.length === 0) return;
      
      // Calculate return value and record returned inventory
      items.forEach(item => {
        // Apply manufacturer return policy
        // Only return items if there's significant inventory left
        if (item.currentQuantity > 5) {
          const returnValue = item.price * item.currentQuantity * this.getManufacturerReturnRate(manufacturer.id);
          
          this.returnedInventory.push({
            year,
            productId: item.id,
            manufacturer: manufacturer.id,
            quantity: item.currentQuantity,
            returnValue,
            date: new Date(year, 11, 31) // December 31st
          });
          
          // Clear inventory
          item.currentQuantity = 0;
        }
      });
    });
  }
  
  /**
   * Returns the refund rate for a manufacturer
   */
  getManufacturerReturnRate(manufacturerId) {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    switch (manufacturer.name) {
      case "UrbanThreads": return 0.7;
      case "ElegantEssentials": return 0.6;
      case "ActivePeak": return 0.5;
      case "SeasonalStyles": return 0.4;
      default: return 0.5;
    }
  }
  
  /**
   * Analyzes current inventory levels by gender and size
   */
  analyzeCurrentInventory() {
    const currentInventory = this.inventory.filter(item => item.year === this.currentYear);
    
    // Group by gender
    const genderGroups = {};
    genders.forEach(gender => {
      genderGroups[gender] = currentInventory.filter(item => item.gender === gender);
    });
    
    // Analyze each gender group
    const analysis = {};
    Object.keys(genderGroups).forEach(gender => {
      const items = genderGroups[gender];
      
      // Skip if no items
      if (items.length === 0) {
        analysis[gender] = { totalItems: 0, sizeDistribution: {} };
        return;
      }
      
      // Group by size
      const sizeGroups = {};
      items.forEach(item => {
        if (!sizeGroups[item.size]) {
          sizeGroups[item.size] = [];
        }
        sizeGroups[item.size].push(item);
      });
      
      // Calculate size distribution
      const sizeDistribution = {};
      Object.keys(sizeGroups).forEach(size => {
        const totalQuantity = sizeGroups[size].reduce((sum, item) => sum + item.currentQuantity, 0);
        sizeDistribution[size] = {
          itemCount: sizeGroups[size].length,
          totalQuantity,
          percentageOfInventory: 0 // Will calculate after totaling
        };
      });
      
      // Calculate total inventory for this gender
      const totalInventoryCount = items.reduce((sum, item) => sum + item.currentQuantity, 0);
      
      // Update percentage values
      Object.keys(sizeDistribution).forEach(size => {
        sizeDistribution[size].percentageOfInventory = 
          totalInventoryCount > 0 
            ? (sizeDistribution[size].totalQuantity / totalInventoryCount * 100).toFixed(2)
            : 0;
      });
      
      analysis[gender] = {
        totalItems: totalInventoryCount,
        sizeDistribution
      };
    });
    
    return analysis;
  }
  
  /**
   * Analyzes sales data to identify trends by size
   */
  analyzeSalesBySize() {
    // Group sales by gender and size
    const genderSizeGroups = {};
    
    // Initialize structure
    genders.forEach(gender => {
      genderSizeGroups[gender] = {};
      
      // Initialize all possible sizes
      categories.forEach(category => {
        const sizesForCategory = sizes[category.toLowerCase()] || [];
        sizesForCategory.forEach(size => {
          if (!genderSizeGroups[gender][size]) {
            genderSizeGroups[gender][size] = {
              totalSold: 0,
              revenue: 0,
              transactions: 0
            };
          }
        });
      });
    });
    
    // Process sales history to populate data
    this.salesHistory.forEach(sale => {
      // Find the product info from inventory
      const product = this.inventory.find(item => item.id === sale.productId);
      if (!product) return;
      
      const gender = product.gender;
      const size = sale.size;
      
      if (!genderSizeGroups[gender][size]) {
        genderSizeGroups[gender][size] = {
          totalSold: 0,
          revenue: 0,
          transactions: 0
        };
      }
      
      // Update counts
      genderSizeGroups[gender][size].totalSold += sale.quantity;
      genderSizeGroups[gender][size].revenue += sale.totalPrice;
      genderSizeGroups[gender][size].transactions += 1;
    });
    
    // Calculate totals and percentages for each gender
    const analysis = {};
    
    genders.forEach(gender => {
      const sizeData = genderSizeGroups[gender];
      
      const totalSold = Object.values(sizeData).reduce((sum, data) => sum + data.totalSold, 0);
      const totalRevenue = Object.values(sizeData).reduce((sum, data) => sum + data.revenue, 0);
      
      const sizeAnalysis = {};
      Object.keys(sizeData).forEach(size => {
        const data = sizeData[size];
        
        // Only include sizes with sales
        if (data.totalSold > 0) {
          sizeAnalysis[size] = {
            ...data,
            percentageOfSales: totalSold > 0 ? (data.totalSold / totalSold * 100).toFixed(2) : 0,
            percentageOfRevenue: totalRevenue > 0 ? (data.revenue / totalRevenue * 100).toFixed(2) : 0,
            averageTransactionValue: data.transactions > 0 ? (data.revenue / data.transactions).toFixed(2) : 0
          };
        }
      });
      
      analysis[gender] = {
        totalSold,
        totalRevenue,
        totalTransactions: Object.values(sizeData).reduce((sum, data) => sum + data.transactions, 0),
        sizeAnalysis
      };
    });
    
    return analysis;
  }
  
  /**
   * Generates a recommendation report for inventory optimization
   */
  generateInventoryOptimizationReport() {
    const inventoryAnalysis = this.analyzeCurrentInventory();
    const salesAnalysis = this.analyzeSalesBySize();
    
    const report = {
      summary: "Inventory Optimization Recommendations",
      date: new Date(),
      genderAnalysis: {}
    };
    
    // Analyze each gender's inventory vs sales
    genders.forEach(gender => {
      const genderInventory = inventoryAnalysis[gender] || { totalItems: 0, sizeDistribution: {} };
      const genderSales = salesAnalysis[gender] || { totalSold: 0, sizeAnalysis: {} };
      
      const sizeRecommendations = [];
      
      // Compare inventory distribution to sales distribution for each size
      const allSizes = new Set([
        ...Object.keys(genderInventory.sizeDistribution),
        ...Object.keys(genderSales.sizeAnalysis)
      ]);
      
      allSizes.forEach(size => {
        const inventoryData = genderInventory.sizeDistribution[size] || { totalQuantity: 0, percentageOfInventory: 0 };
        const salesData = genderSales.sizeAnalysis[size] || { totalSold: 0, percentageOfSales: 0 };
        
        // Skip sizes with no data
        if (inventoryData.totalQuantity === 0 && salesData.totalSold === 0) return;
        
        // Calculate inventory to sales ratio
        const inventoryPercentage = parseFloat(inventoryData.percentageOfInventory) || 0;
        const salesPercentage = parseFloat(salesData.percentageOfSales) || 0;
        
        let status, recommendation;
        let difference = inventoryPercentage - salesPercentage;
        
        // Determine status and recommendation
        if (Math.abs(difference) < 5) {
          status = "Balanced";
          recommendation = "Maintain current inventory levels";
        } else if (difference > 15) {
          status = "Significantly Overstocked";
          recommendation = "Reduce inventory by 30-40% and return to manufacturer";
        } else if (difference > 5) {
          status = "Overstocked";
          recommendation = "Reduce inventory by 10-20% in next order";
        } else if (difference < -15) {
          status = "Significantly Understocked";
          recommendation = "Increase inventory by 30-40% immediately";
        } else {
          status = "Understocked";
          recommendation = "Increase inventory by 10-20% in next order";
        }
        
        sizeRecommendations.push({
          size,
          currentInventory: inventoryData.totalQuantity,
          inventoryPercentage,
          salesQuantity: salesData.totalSold,
          salesPercentage,
          status,
          difference: difference.toFixed(2),
          recommendation
        });
      });
      
      // Add gender-specific summary
      let genderSummary;
      if (gender === "Men") {
        // Check for the issue mentioned in the anecdotal evidence
        const smallMediumInventory = 
          (genderInventory.sizeDistribution["S"]?.totalQuantity ||