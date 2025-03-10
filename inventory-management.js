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
          (genderInventory.sizeDistribution["S"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["M"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["30"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["32"]?.totalQuantity || 0);
          
        const largeXLInventory = 
          (genderInventory.sizeDistribution["L"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["XL"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["XXL"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["36"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["38"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["40"]?.totalQuantity || 0) +
          (genderInventory.sizeDistribution["42"]?.totalQuantity || 0);
          
        const totalMensInventory = smallMediumInventory + largeXLInventory;
        
        const smallMediumPercentage = totalMensInventory > 0 
          ? (smallMediumInventory / totalMensInventory * 100).toFixed(2) 
          : 0;
          
        if (parseFloat(smallMediumPercentage) > 80) {
          genderSummary = `CRITICAL: Men's inventory is severely imbalanced with ${smallMediumPercentage}% in S/M sizes. This matches the anecdotal evidence of visiting the store and finding 99% of men's garments were smalls and mediums. Immediate rebalancing required.`;
        } else if (parseFloat(smallMediumPercentage) > 65) {
          genderSummary = `WARNING: Men's inventory is imbalanced with ${smallMediumPercentage}% in S/M sizes. Consider rebalancing in next order cycle.`;
        } else {
          genderSummary = `Men's inventory size distribution appears balanced (${smallMediumPercentage}% S/M sizes).`;
        }
      } else if (gender === "Women") {
        // Check for any imbalance in women's sizes
        const smallSizes = ["0", "2", "4", "XS", "S"];
        const mediumSizes = ["6", "8", "10", "M"];
        const largeSizes = ["12", "14", "16", "L", "XL", "XXL"];
        
        const smallInventory = smallSizes.reduce((sum, size) => 
          sum + (genderInventory.sizeDistribution[size]?.totalQuantity || 0), 0);
          
        const mediumInventory = mediumSizes.reduce((sum, size) => 
          sum + (genderInventory.sizeDistribution[size]?.totalQuantity || 0), 0);
          
        const largeInventory = largeSizes.reduce((sum, size) => 
          sum + (genderInventory.sizeDistribution[size]?.totalQuantity || 0), 0);
          
        const totalWomensInventory = smallInventory + mediumInventory + largeInventory;
        
        if (totalWomensInventory === 0) {
          genderSummary = "No women's inventory data available for analysis.";
        } else {
          const smallPercentage = (smallInventory / totalWomensInventory * 100).toFixed(2);
          const mediumPercentage = (mediumInventory / totalWomensInventory * 100).toFixed(2);
          const largePercentage = (largeInventory / totalWomensInventory * 100).toFixed(2);
          
          genderSummary = `Women's inventory distribution: ${smallPercentage}% small sizes, ${mediumPercentage}% medium sizes, ${largePercentage}% large sizes.`;
          
          // Check for imbalances
          if (parseFloat(smallPercentage) > 50 || parseFloat(mediumPercentage) > 50 || parseFloat(largePercentage) > 50) {
            genderSummary += " Potential imbalance detected, consider rebalancing.";
          }
        }
      } else {
        genderSummary = `${gender} inventory analysis completed.`;
      }
      
      // Identify top selling sizes for this gender
      const sizesBySales = Object.entries(genderSales.sizeAnalysis || {})
        .sort((a, b) => b[1].totalSold - a[1].totalSold)
        .slice(0, 3)
        .map(([size, data]) => ({
          size,
          quantitySold: data.totalSold,
          percentageOfSales: data.percentageOfSales
        }));
        
      // Identify most overstocked sizes
      const mostOverstocked = sizeRecommendations
        .filter(rec => rec.status.includes("Overstocked"))
        .sort((a, b) => parseFloat(b.difference) - parseFloat(a.difference))
        .slice(0, 3);
        
      // Identify most understocked sizes
      const mostUnderstocked = sizeRecommendations
        .filter(rec => rec.status.includes("Understocked"))
        .sort((a, b) => parseFloat(a.difference) - parseFloat(b.difference))
        .slice(0, 3);
      
      report.genderAnalysis[gender] = {
        summary: genderSummary,
        inventoryTotal: genderInventory.totalItems,
        salesTotal: genderSales.totalSold,
        topSellingSizes: sizesBySales,
        mostOverstocked,
        mostUnderstocked,
        detailedRecommendations: sizeRecommendations.sort((a, b) => b.salesQuantity - a.salesQuantity)
      };
    });
    
    // Generate overall summary
    const overallSummary = [];
    
    // Check for the men's inventory issue specifically
    if (report.genderAnalysis.Men?.summary.includes("CRITICAL")) {
      overallSummary.push(report.genderAnalysis.Men.summary);
      
      // Add specific return recommendations
      const menOverstocked = report.genderAnalysis.Men.mostOverstocked;
      if (menOverstocked.length > 0) {
        overallSummary.push("Recommended actions for men's inventory:");
        menOverstocked.forEach(item => {
          overallSummary.push(`- Return size ${item.size} items to manufacturers (currently ${item.currentInventory} units, ${item.difference}% over sales rate)`);
        });
      }
      
      // Add specific purchase recommendations
      const menUnderstocked = report.genderAnalysis.Men.mostUnderstocked;
      if (menUnderstocked.length > 0) {
        overallSummary.push("Immediate purchase recommendations:");
        menUnderstocked.forEach(item => {
          overallSummary.push(`- Order more size ${item.size} items (currently ${item.currentInventory} units, ${Math.abs(parseFloat(item.difference))}% under sales rate)`);
        });
      }
    }
    
    // Check for other critical issues
    Object.entries(report.genderAnalysis).forEach(([gender, analysis]) => {
      if (gender !== "Men" && analysis.summary.includes("imbalance")) {
        overallSummary.push(analysis.summary);
      }
    });
    
    // Add manufacturer return recommendations
    overallSummary.push("\nManufacturer return recommendations:");
    manufacturers.forEach(manufacturer => {
      // Create lists of what to return to each manufacturer
      const returnItems = [];
      Object.values(report.genderAnalysis).forEach(analysis => {
        analysis.mostOverstocked.forEach(item => {
          // Find all inventory items matching this size and category
          const matchingItems = this.inventory.filter(invItem => 
            invItem.year === this.currentYear &&
            invItem.manufacturer === manufacturer.id &&
            invItem.size === item.size &&
            invItem.currentQuantity > 5 // Only consider items with significant stock
          );
          
          if (matchingItems.length > 0) {
            const totalQuantity = matchingItems.reduce((sum, item) => sum + item.currentQuantity, 0);
            if (totalQuantity > 0) {
              returnItems.push({
                size: item.size,
                quantity: totalQuantity,
                items: matchingItems.map(i => i.name)
              });
            }
          }
        });
      });
      
      if (returnItems.length > 0) {
        overallSummary.push(`\n${manufacturer.name} (${manufacturer.returnPolicy}):`);
        returnItems.forEach(item => {
          overallSummary.push(`- Return ${item.quantity} units of size ${item.size}`);
        });
      }
    });
    
    report.overallSummary = overallSummary;
    return report;
  }
  
  /**
   * Simulates placing a new purchase order for next season
   * with improved size distribution based on sales data
   */
  generateOptimizedPurchaseOrder(manufacturerId, season, year = this.currentYear) {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    if (!manufacturer) return null;
    
    // Analyze sales to inform new order quantities
    const salesAnalysis = this.analyzeSalesBySize();
    
    // Create an optimized order
    const order = {
      orderId: `PO-${year}-${season}-${manufacturerId}`,
      manufacturer: manufacturer.name,
      date: new Date(),
      season,
      year,
      items: [],
      totalQuantity: 0,
      totalCost: 0
    };
    
    // Generate representative items for the manufacturer
    const categories = ["Tops", "Bottoms", "Outerwear"];
    const genders = ["Men", "Women", "Unisex"];
    
    // Estimate how many of each product to create based on manufacturer specialty
    let productDistribution = {
      Tops: 0.4,
      Bottoms: 0.3,
      Outerwear: 0.3
    };
    
    // Adjust distribution based on manufacturer specialty
    if (manufacturer.specialty.includes("formal")) {
      productDistribution = {
        Tops: 0.3,
        Bottoms: 0.3,
        Outerwear: 0.4
      };
    } else if (manufacturer.specialty.includes("athletic")) {
      productDistribution = {
        Tops: 0.5,
        Bottoms: 0.4,
        Outerwear: 0.1
      };
    }
    
    // Generate order items
    categories.forEach(category => {
      genders.forEach(gender => {
        const productQuantity = Math.ceil(manufacturer.minOrderQuantity * productDistribution[category] / genders.length);
        
        // Get available sizes for this category
        const availableSizes = sizes[category.toLowerCase()] || sizes.accessories;
        
        // Get sales data for this gender to inform size distribution
        const genderSales = salesAnalysis[gender] || { totalSold: 0, sizeAnalysis: {} };
        
        // Calculate optimal size distribution based on sales
        const sizeDistribution = {};
        let totalSalesForRelevantSizes = 0;
        
        // Calculate total sales for sizes in this category
        availableSizes.forEach(size => {
          const salesForSize = genderSales.sizeAnalysis[size]?.totalSold || 0;
          totalSalesForRelevantSizes += salesForSize;
        });
        
        // Calculate percentage distribution based on sales
        availableSizes.forEach(size => {
          const salesForSize = genderSales.sizeAnalysis[size]?.totalSold || 0;
          // Ensure at least some minimum percentage for each size
          if (totalSalesForRelevantSizes > 0) {
            sizeDistribution[size] = Math.max(
              0.05, // Minimum 5% of order quantity for each size
              salesForSize / totalSalesForRelevantSizes
            );
          } else {
            // If no sales data, distribute evenly
            sizeDistribution[size] = 1 / availableSizes.length;
          }
        });
        
        // Normalize distribution to ensure it sums to 1
        const totalDistribution = Object.values(sizeDistribution).reduce((sum, val) => sum + val, 0);
        Object.keys(sizeDistribution).forEach(size => {
          sizeDistribution[size] = sizeDistribution[size] / totalDistribution;
        });
        
        // Create order items for each size
        availableSizes.forEach(size => {
          const quantity = Math.max(5, Math.round(productQuantity * sizeDistribution[size]));
          const price = 10 + Math.random() * 40; // Random wholesale price
          
          order.items.push({
            name: `${season} ${gender} ${category} - Size ${size}`,
            category,
            gender,
            size,
            quantity,
            unitCost: price.toFixed(2),
            totalCost: (price * quantity).toFixed(2)
          });
          
          order.totalQuantity += quantity;
          order.totalCost += price * quantity;
        });
      });
    });
    
    order.totalCost = order.totalCost.toFixed(2);
    this.purchaseOrders.push(order);
    
    return order;
  }
  
  /**
   * Creates a visualization-friendly summary of inventory status
   */
  getInventoryDashboardData() {
    const inventoryAnalysis = this.analyzeCurrentInventory();
    const salesAnalysis = this.analyzeSalesBySize();
    
    // Prepare data for visualization
    const dashboardData = {
      inventoryByGender: [],
      inventoryBySize: [],
      salesByGender: [],
      salesBySize: [],
      sizeMismatchData: []
    };
    
    // Inventory by gender
    genders.forEach(gender => {
      dashboardData.inventoryByGender.push({
        gender,
        quantity: inventoryAnalysis[gender]?.totalItems || 0
      });
      
      // Sales by gender
      dashboardData.salesByGender.push({
        gender,
        quantity: salesAnalysis[gender]?.totalSold || 0
      });
    });
    
    // Inventory and sales by size for men (focus on the problem area)
    const menInventory = inventoryAnalysis["Men"] || { sizeDistribution: {} };
    const menSales = salesAnalysis["Men"] || { sizeAnalysis: {} };
    
    // Get all men's sizes
    const allMenSizes = new Set([
      ...Object.keys(menInventory.sizeDistribution),
      ...Object.keys(menSales.sizeAnalysis)
    ]);
    
    // Create inventory by size data
    allMenSizes.forEach(size => {
      const inventoryQuantity = menInventory.sizeDistribution[size]?.totalQuantity || 0;
      const salesQuantity = menSales.sizeAnalysis[size]?.totalSold || 0;
      
      if (inventoryQuantity > 0 || salesQuantity > 0) {
        dashboardData.inventoryBySize.push({
          gender: "Men",
          size,
          quantity: inventoryQuantity
        });
        
        dashboardData.salesBySize.push({
          gender: "Men",
          size,
          quantity: salesQuantity
        });
        
        // Calculate mismatch between inventory and sales
        const inventoryPercentage = menInventory.totalItems > 0 
          ? (inventoryQuantity / menInventory.totalItems * 100) 
          : 0;
          
        const salesPercentage = menSales.totalSold > 0 
          ? (salesQuantity / menSales.totalSold * 100) 
          : 0;
          
        dashboardData.sizeMismatchData.push({
          gender: "Men",
          size,
          inventoryPercentage: inventoryPercentage.toFixed(2),
          salesPercentage: salesPercentage.toFixed(2),
          difference: (inventoryPercentage - salesPercentage).toFixed(2)
        });
      }
    });
    
    return dashboardData;
  }
}

// Test the system
const inventorySystem = new InventoryManagementSystem();

// Generate the inventory report that would identify the men's size issue
const report = inventorySystem.generateInventoryOptimizationReport();
console.log("=== INVENTORY OPTIMIZATION REPORT ===");
console.log("\nOverall Summary:");
report.overallSummary.forEach(line => console.log(line));

// Print out the men's inventory analysis specifically
console.log("\n=== MEN'S INVENTORY ANALYSIS ===");
console.log(report.genderAnalysis.Men.summary);
console.log("\nMost overstocked sizes:");
report.genderAnalysis.Men.mostOverstocked.forEach(item => {
  console.log(`- Size ${item.size}: ${item.currentInventory} units, ${item.difference}% over sales rate`);
});

console.log("\nMost understocked sizes:");
report.genderAnalysis.Men.mostUnderstocked.forEach(item => {
  console.log(`- Size ${item.size}: ${item.currentInventory} units, ${Math.abs(parseFloat(item.difference))}% under sales rate`);
});

// Generate an optimized purchase order for one manufacturer
const newOrder = inventorySystem.generateOptimizedPurchaseOrder(1, "Fall", 2025);
console.log("\n=== OPTIMIZED PURCHASE ORDER ===");
console.log(`Order ID: ${newOrder.orderId}`);
console.log(`Manufacturer: ${newOrder.manufacturer}`);
console.log(`Season: ${newOrder.season} ${newOrder.year}`);
console.log(`Total Quantity: ${newOrder.totalQuantity}`);
console.log(`Total Cost: ${newOrder.totalCost}`);

// Print size distribution summary of the new order
console.log("\nSize Distribution in New Order:");
const menOrderItems = newOrder.items.filter(item => item.gender === "Men");
const sizeGroups = {};

menOrderItems.forEach(item => {
  if (!sizeGroups[item.size]) sizeGroups[item.size] = 0;
  sizeGroups[item.size] += item.quantity;
});

const totalMenItems = menOrderItems.reduce((sum, item) => sum + item.quantity, 0);
Object.keys(sizeGroups).sort().forEach(size => {
  const percentage = ((sizeGroups[size] / totalMenItems) * 100).toFixed(2);
  console.log(`- Size ${size}: ${sizeGroups[size]} units (${percentage}%)`);
});
