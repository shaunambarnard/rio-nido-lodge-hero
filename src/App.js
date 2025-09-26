import React, { useState, useEffect } from 'react';

const RioNidoLodgeApp = () => {
  const [currentStep, setCurrentStep] = useState('form');
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    tripDuration: 1,
    partySize: 2,
    interests: [],
    travelStyle: 'balanced',
    specialRequests: '',
    checkIn: '',
    weather: 'sunny'
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [selectedSignatureExperience, setSelectedSignatureExperience] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  // Get current time for business hours
  const getCurrentHour = () => new Date().getHours();

  // Business database with proper syntax
  const businessDatabase = {
    food: [
      { 
        name: "boon eat + drink", 
        type: "Farm-to-Table Restaurant", 
        description: "Celebrity Chef Crista Luedtke's flagship farm-to-table restaurant", 
        rating: 4.8, 
        priceRange: "$$$",
        localInsight: "Chef's tasting menu changes with what's fresh from local farms that morning",
        driveTime: "2 min walk",
        category: "food",
        cluster: "downtown",
        hours: { open: 17, close: 22, timeAppropriate: ['evening'] },
        signature: true
      },
      { 
        name: "The Hot Box", 
        type: "Gourmet Hot Dogs & Sandwiches", 
        description: "Creative hot dogs and artisanal sandwiches with local ingredients", 
        rating: 4.6, 
        priceRange: "$$",
        localInsight: "The 'Russian River Dog' topped with local sauerkraut is a hidden menu item",
        driveTime: "3 min walk",
        category: "food",
        cluster: "downtown",
        hours: { open: 11, close: 19, timeAppropriate: ['afternoon', 'evening'] }
      },
      { 
        name: "Graze", 
        type: "Lodge Restaurant", 
        description: "Rio Nido Lodge's own restaurant featuring local Sonoma ingredients", 
        rating: 4.5, 
        priceRange: "$$",
        localInsight: "Lodge guests get priority reservations - try the locally-foraged mushroom dishes",
        driveTime: "1 min walk",
        category: "food",
        cluster: "downtown",
        hours: { open: 8, close: 21, timeAppropriate: ['morning', 'afternoon', 'evening'] }
      },
      { 
        name: "Hole in the Wall", 
        type: "Famous Breakfast Spot", 
        description: "Legendary breakfast restaurant with Dutch baby pancakes and huge portions", 
        rating: 4.7, 
        priceRange: "$$",
        localInsight: "The Dutch baby pancake is the size of a dinner plate - order one to share first!",
        driveTime: "12 min drive",
        category: "food",
        cluster: "sebastopol",
        hours: { open: 7, close: 14, timeAppropriate: ['morning', 'afternoon'] },
        signature: true
      },
      { 
        name: "Saucy Mamas", 
        type: "BBQ & Comfort Food", 
        description: "Authentic BBQ with house-made sauces and comfort food classics", 
        rating: 4.4, 
        priceRange: "$$",
        localInsight: "Their tri-tip is smoked with local apple wood - comes with 6 house-made sauce options",
        driveTime: "5 min drive",
        category: "food",
        cluster: "downtown",
        hours: { open: 12, close: 20, timeAppropriate: ['afternoon', 'evening'] }
      },
      { 
        name: "Terrapin Creek Cafe", 
        type: "Coastal Fine Dining", 
        description: "Award-winning restaurant featuring fresh Sonoma Coast cuisine", 
        rating: 4.8, 
        priceRange: "$$$$",
        localInsight: "Chef Kenny Kan sources directly from local fishermen - menu changes with daily catch",
        driveTime: "28 min drive",
        category: "food",
        cluster: "coastal",
        hours: { open: 17, close: 21, timeAppropriate: ['evening'] },
        signature: true
      },
      { 
        name: "Spud Point Crab Company", 
        type: "Waterfront Seafood Shack", 
        description: "Family-owned crab shack with bay views and fresh Dungeness crab", 
        rating: 4.5, 
        priceRange: "$$",
        localInsight: "Come at sunset for the best crab sandwich and harbor views - cash only!",
        driveTime: "26 min drive",
        category: "food",
        cluster: "coastal",
        hours: { open: 9, close: 18, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "Howard's in Occidental", 
        type: "Famous Breakfast Restaurant", 
        description: "Legendary breakfast spot famous for fabulous morning meals", 
        rating: 4.6, 
        priceRange: "$$",
        localInsight: "Been serving 'the best breakfast in Sonoma County' since 1946 - expect a wait on weekends",
        driveTime: "9 min drive",
        category: "food",
        cluster: "occidental",
        hours: { open: 7, close: 14, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "Jilly's Roadhouse", 
        type: "Coastal Roadhouse", 
        description: "Jenner roadhouse with ocean views and hearty American fare", 
        rating: 4.2, 
        priceRange: "$$",
        localInsight: "Stop here on the drive to the coast - the burger and beer combo is a local favorite",
        driveTime: "24 min drive",
        category: "food",
        cluster: "coastal",
        hours: { open: 11, close: 20, timeAppropriate: ['afternoon', 'evening'] }
      },
      { 
        name: "Russian River Pub", 
        type: "Family Gastropub", 
        description: "Laid-back family spot with large outdoor seating and fire pit", 
        rating: 4.3, 
        priceRange: "$$",
        localInsight: "The outdoor fire pit is perfect for chilly Russian River evenings - s'mores available!",
        driveTime: "7 min drive",
        category: "food",
        cluster: "forestville",
        hours: { open: 11, close: 21, timeAppropriate: ['afternoon', 'evening'] }
      }
    ],
    
    coffee: [
      { 
        name: "Coffee Bazaar", 
        type: "Local Coffee Roastery", 
        description: "Small-batch roastery with beans sourced from sustainable farms", 
        rating: 4.6, 
        priceRange: "$$",
        localInsight: "The owner personally travels to origin farms - try the Guatemala Huehuetenango",
        driveTime: "3 min walk",
        category: "coffee",
        cluster: "downtown",
        hours: { open: 6, close: 18, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "River Electric", 
        type: "Coffee Shop & Community Hub", 
        description: "Local gathering spot with specialty coffee and community vibe", 
        rating: 4.7, 
        priceRange: "$$",
        localInsight: "The 'Russian River Roast' is their signature blend - locals gather here for morning gossip",
        driveTime: "4 min walk",
        category: "coffee",
        cluster: "downtown",
        hours: { open: 7, close: 17, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "Big Bottom Market", 
        type: "Gourmet Market & Café", 
        description: "Artisanal market with exceptional coffee and baked goods", 
        rating: 4.4, 
        priceRange: "$$",
        localInsight: "Their biscuits are so famous, Food Network featured them twice",
        driveTime: "5 min walk",
        category: "coffee",
        cluster: "downtown",
        hours: { open: 8, close: 16, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "Cafe Aquatica", 
        type: "Coastal Cafe", 
        description: "Waterfront coffee and light breakfast on the way to Jenner", 
        rating: 4.6, 
        priceRange: "$$",
        localInsight: "Perfect coffee stop before exploring the coast - get a table on the deck",
        driveTime: "22 min drive",
        category: "coffee",
        cluster: "coastal",
        hours: { open: 7, close: 16, timeAppropriate: ['morning', 'afternoon'] }
      }
    ],
    
    wine: [
      { 
        name: "Korbel Champagne Cellars", 
        type: "Historic Champagne Producer", 
        description: "California's oldest champagne house with guided tastings", 
        rating: 4.5, 
        priceRange: "$$",
        localInsight: "The original hand-carved cellars from 1882 maintain perfect aging temperature",
        driveTime: "8 min drive",
        category: "wine",
        cluster: "russian_river",
        hours: { open: 10, close: 16, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "Furthermore Wines", 
        type: "Boutique Winery", 
        description: "Small-production wines in an intimate tasting room", 
        rating: 4.7, 
        priceRange: "$$$",
        localInsight: "Only 500 cases per year - their Pinot Noir sells out by spring",
        driveTime: "12 min drive",
        category: "wine",
        cluster: "russian_river",
        hours: { open: 11, close: 17, timeAppropriate: ['afternoon'] },
        signature: true
      },
      { 
        name: "Williams Selyem Winery", 
        type: "Renowned Pinot Noir Producer", 
        description: "Legendary winery known for exceptional Russian River Pinot Noir", 
        rating: 4.8, 
        priceRange: "$$$$",
        localInsight: "Wait list only - but lodge guests sometimes get priority tastings",
        driveTime: "15 min drive",
        category: "wine",
        cluster: "russian_river",
        hours: { open: 11, close: 16, timeAppropriate: ['afternoon'] },
        signature: true
      },
      { 
        name: "Iron Horse Vineyards", 
        type: "Sparkling Wine Estate", 
        description: "Family estate producing world-class sparkling wines since 1976", 
        rating: 4.6, 
        priceRange: "$$$",
        localInsight: "Their bubbles were served at White House state dinners during 4 presidencies",
        driveTime: "18 min drive",
        category: "wine",
        cluster: "russian_river",
        hours: { open: 10, close: 16, timeAppropriate: ['morning', 'afternoon'] }
      }
    ],
    
    arts: [
      { 
        name: "Guerneville Arts Center", 
        type: "Community Art Gallery", 
        description: "Local artists' cooperative showcasing Russian River Valley creativity", 
        rating: 4.2, 
        priceRange: "Free",
        localInsight: "First Friday art walks feature wine and meet the artists",
        driveTime: "2 min walk",
        category: "arts",
        cluster: "downtown",
        hours: { open: 10, close: 17, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "Highland Dell Lodge Sculpture Garden", 
        type: "Outdoor Art Installation", 
        description: "Hidden sculpture garden among redwood groves", 
        rating: 4.4, 
        priceRange: "$",
        localInsight: "The metal sculptures change color throughout the day as light filters through trees",
        driveTime: "6 min drive",
        category: "arts",
        cluster: "russian_river",
        hours: { open: 8, close: 18, timeAppropriate: ['morning', 'afternoon'] }
      }
    ],
    
    nature: [
      { 
        name: "Armstrong Redwoods State Natural Reserve", 
        type: "Old Growth Redwood Forest", 
        description: "Ancient redwood cathedral with trees over 1,400 years old", 
        rating: 4.8, 
        priceRange: "Free",
        localInsight: "Visit the Colonel Armstrong tree - it's been growing since before Columbus sailed",
        driveTime: "8 min drive",
        category: "nature",
        cluster: "russian_river",
        hours: { open: 8, close: 19, timeAppropriate: ['morning', 'afternoon'] },
        signature: true
      },
      { 
        name: "Russian River", 
        type: "Swimming & Recreation", 
        description: "Perfect swimming holes and riverside relaxation", 
        rating: 4.6, 
        priceRange: "Free",
        localInsight: "Johnson's Beach has the warmest, safest swimming - locals' secret spot",
        driveTime: "4 min walk",
        category: "nature",
        cluster: "downtown",
        hours: { open: 6, close: 20, timeAppropriate: ['morning', 'afternoon', 'evening'] }
      },
      { 
        name: "Goat Rock Beach", 
        type: "Dramatic Coastline", 
        description: "Stunning coastal views where Russian River meets the Pacific", 
        rating: 4.7, 
        priceRange: "Free",
        localInsight: "Harbor seals give birth here in spring - bring binoculars for pup watching",
        driveTime: "25 min drive",
        category: "nature",
        cluster: "coastal",
        hours: { open: 6, close: 20, timeAppropriate: ['morning', 'afternoon', 'evening'] }
      },
      { 
        name: "Salmon Creek Beach", 
        type: "Expansive Coastal Beach", 
        description: "Two-mile stretch of sandy beach perfect for walking and beachcombing", 
        rating: 4.6, 
        priceRange: "Free",
        localInsight: "North side is great for surfing, south side is family-friendly with calmer waters",
        driveTime: "22 min drive",
        category: "nature",
        cluster: "coastal",
        hours: { open: 6, close: 20, timeAppropriate: ['morning', 'afternoon', 'evening'] }
      },
      { 
        name: "Bodega Head", 
        type: "Dramatic Coastal Headland", 
        description: "360-degree ocean views and prime whale watching location", 
        rating: 4.8, 
        priceRange: "Free",
        localInsight: "Best whale watching from December-April - bring binoculars and warm clothes",
        driveTime: "28 min drive",
        category: "nature",
        cluster: "coastal",
        hours: { open: 6, close: 20, timeAppropriate: ['morning', 'afternoon', 'evening'] }
      }
    ],
    
    shopping: [
      { 
        name: "Antique Society", 
        type: "Vintage Treasures", 
        description: "Curated antiques and vintage finds in historic building", 
        rating: 4.3, 
        priceRange: "$$",
        localInsight: "The owner finds pieces from old Russian River estates - unique local history",
        driveTime: "3 min walk",
        category: "shopping",
        cluster: "downtown",
        hours: { open: 10, close: 17, timeAppropriate: ['morning', 'afternoon'] }
      },
      { 
        name: "Andy's Local Market", 
        type: "Family-Owned Grocery", 
        description: "Family-owned Sebastopol grocery store since 1979 with local products", 
        rating: 4.4, 
        priceRange: "$$",
        localInsight: "Best selection of local wines and the staff knows every producer personally",
        driveTime: "15 min drive",
        category: "shopping",
        cluster: "sebastopol",
        hours: { open: 7, close: 21, timeAppropriate: ['morning', 'afternoon', 'evening'] }
      },
      { 
        name: "Oliver's Market", 
        type: "Local Sonoma Chain", 
        description: "Local Sonoma County market chain with gourmet and organic selections", 
        rating: 4.2, 
        priceRange: "$$",
        localInsight: "Their deli makes the best sandwiches for river picnics - try the 'Sonoma Turkey'",
        driveTime: "12 min drive",
        category: "shopping",
        cluster: "sebastopol",
        hours: { open: 6, close: 22, timeAppropriate: ['morning', 'afternoon', 'evening'] }
      },
      { 
        name: "Candy & Kites", 
        type: "Bodega Bay Taffy Shop", 
        description: "Classic seaside candy shop with homemade saltwater taffy and kites", 
        rating: 4.7, 
        priceRange: "$$",
        localInsight: "Watch them pull the taffy through the window - the lavender flavor uses local Sonoma lavender",
        driveTime: "26 min drive",
        category: "shopping",
        cluster: "coastal",
        hours: { open: 10, close: 18, timeAppropriate: ['morning', 'afternoon'] }
      }
    ]
  };

  // Signature Experiences
  const signatureExperiences = [
    {
      id: 'redwood_meditation',
      name: 'Private Redwood Grove Meditation',
      description: 'Guided meditation among 800-year-old redwoods at dawn with experienced mindfulness instructor',
      location: 'Armstrong Redwoods State Natural Reserve',
      distance: '8 miles',
      duration: '90 minutes',
      priceRange: '$$$',
      bookingRequired: true,
      maxGuests: 6,
      bestTime: 'sunrise',
      localInsight: 'This grove has trees that were saplings when the Vikings reached America'
    },
    {
      id: 'hidden_winery_tour',
      name: 'Secret Cellar Wine Experience',
      description: 'Private tour of hidden wine cellars with the winemaker, featuring reserve tastings',
      location: 'Undisclosed Westside Road Vineyard',
      distance: '12 miles',
      duration: '3 hours',
      priceRange: '$$$$',
      bookingRequired: true,
      maxGuests: 4,
      bestTime: 'afternoon',
      localInsight: 'Only 12 people per year get to taste the reserve barrels'
    },
    {
      id: 'foraging_adventure',
      name: 'Wild Mushroom & Foraging Walk',
      description: 'Expert-guided foraging in old-growth redwood understory with cooking lesson',
      location: 'Private forest preserve',
      distance: '6 miles',
      duration: '4 hours',
      priceRange: '$$$$',
      bookingRequired: true,
      maxGuests: 8,
      bestTime: 'morning',
      localInsight: 'Find chanterelles, oyster mushrooms, and wild herbs locals have harvested for generations'
    }
  ];

  // Interest options
  const interestOptions = [
    { id: 'food', label: 'Exceptional Dining', icon: '🍽️' },
    { id: 'coffee', label: 'Coffee & Cafés', icon: '☕' },
    { id: 'wine', label: 'Wine Tasting', icon: '🍷' },
    { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
    { id: 'nature', label: 'Nature & Outdoors', icon: '🌲' },
    { id: 'shopping', label: 'Local Shopping', icon: '🛍️' }
  ];

  // Travel style options
  const travelStyles = [
    { id: 'relaxed', label: 'Relaxed Explorer', description: '2-3 activities per day' },
    { id: 'balanced', label: 'Balanced Adventure', description: '4-5 activities per day' },
    { id: 'packed', label: 'Full Immersion', description: '6+ activities per day' }
  ];

  // Check if business is currently open
  const isCurrentlyOpen = (business) => {
    const currentHour = getCurrentHour();
    return currentHour >= business.hours.open && currentHour < business.hours.close;
  };

  // Smart itinerary generation with proper day distribution
  const generateItinerary = () => {
    setLoading(true);
    
    // Get all relevant businesses
    let allRecommendations = [];
    
    guestData.interests.forEach(interest => {
      if (businessDatabase[interest]) {
        allRecommendations = [...allRecommendations, ...businessDatabase[interest]];
      }
    });

    // If no interests selected, add some defaults to prevent empty days
    if (allRecommendations.length === 0) {
      allRecommendations = [
        ...businessDatabase.food.slice(0, 3),
        ...businessDatabase.nature.slice(0, 2),
        ...businessDatabase.coffee.slice(0, 2)
      ];
    }

    // Filter by travel style (number of activities per day)
    const activitiesPerDay = {
      'relaxed': 3,
      'balanced': 4,
      'packed': 6
    };

    const maxActivitiesPerDay = activitiesPerDay[guestData.travelStyle] || 4;

    // Score and sort recommendations
    const scoredRecommendations = allRecommendations.map(business => {
      let score = business.rating * 10;
      
      // Boost signature experiences
      if (business.signature) score += 15;
      
      // Boost currently open businesses
      if (isCurrentlyOpen(business)) score += 10;
      
      // Weather considerations
      if (guestData.weather === 'rainy' && business.category === 'nature' && !business.name.includes('Armstrong')) {
        score -= 20;
      }
      
      return { ...business, score };
    });

    // Remove duplicates and sort by score
    const uniqueRecommendations = scoredRecommendations
      .filter((business, index, self) => 
        index === self.findIndex(b => b.name === business.name))
      .sort((a, b) => b.score - a.score);

    // FIXED: Proper day distribution algorithm
    const distributedItinerary = [];
    
    for (let day = 1; day <= guestData.tripDuration; day++) {
      // Use modulo to cycle through recommendations across days
      const dayActivities = [];
      
      for (let i = 0; i < maxActivitiesPerDay; i++) {
        const recommendationIndex = ((day - 1) * maxActivitiesPerDay + i) % uniqueRecommendations.length;
        if (recommendationIndex < uniqueRecommendations.length) {
          dayActivities.push(uniqueRecommendations[recommendationIndex]);
        }
      }
      
      // If we still don't have enough activities, add more from different clusters
      while (dayActivities.length < maxActivitiesPerDay && dayActivities.length < uniqueRecommendations.length) {
        const remainingBusinesses = uniqueRecommendations.filter(
          business => !dayActivities.find(activity => activity.name === business.name)
        );
        if (remainingBusinesses.length > 0) {
          dayActivities.push(remainingBusinesses[0]);
        } else {
          break;
        }
      }
      
      // Sort activities by optimal timing and location clustering
      const sortedDayActivities = dayActivities.sort((a, b) => {
        // Morning activities first
        if (a.hours.timeAppropriate.includes('morning') && !b.hours.timeAppropriate.includes('morning')) return -1;
        if (!a.hours.timeAppropriate.includes('morning') && b.hours.timeAppropriate.includes('morning')) return 1;
        
        // Then by cluster for efficient routing
        const clusterOrder = ['downtown', 'forestville', 'sebastopol', 'russian_river', 'occidental', 'coastal'];
        return clusterOrder.indexOf(a.cluster) - clusterOrder.indexOf(b.cluster);
      });
      
      distributedItinerary.push({
        day: day,
        date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        }),
        activities: sortedDayActivities,
        cluster: sortedDayActivities.length > 0 ? sortedDayActivities[0].cluster : 'downtown'
      });
    }

    // Generate shareable link
    const shareData = btoa(JSON.stringify({
      guest: guestData.name,
      duration: guestData.tripDuration,
      style: guestData.travelStyle,
      interests: guestData.interests
    }));
    setShareableLink(`${window.location.origin}/?share=${shareData}`);

    // Simulate processing time
    setTimeout(() => {
      setItinerary(distributedItinerary);
      setLoading(false);
      setCurrentStep('itinerary');

      // Analytics tracking
      if (window.gtag) {
        window.gtag('event', 'itinerary_generated', {
          'custom_map': {'duration': guestData.tripDuration, 'interests': guestData.interests.join(',')},
          'value': guestData.tripDuration
        });
      }
    }, 2000);
  };

  // Handle interest selection
  const toggleInterest = (interest) => {
    setGuestData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Signature Experience Modal Component
  const SignatureExperienceModal = () => {
    if (!showSignatureModal || !selectedSignatureExperience) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{selectedSignatureExperience.name}</h2>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-red-50 p-6 rounded-xl border border-amber-200">
                <h3 className="font-bold text-lg text-amber-900 mb-3">Experience Details</h3>
                <p className="text-gray-700 text-lg mb-4">{selectedSignatureExperience.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📍 Location:</span>
                      <span>{selectedSignatureExperience.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📏 Distance:</span>
                      <span>{selectedSignatureExperience.distance}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">⏱️ Duration:</span>
                      <span>{selectedSignatureExperience.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">💰 Price:</span>
                      <span>{selectedSignatureExperience.priceRange}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">👥 Max Guests:</span>
                      <span>{selectedSignatureExperience.maxGuests} people</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">🌅 Best Time:</span>
                      <span className="capitalize">{selectedSignatureExperience.bestTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-bold text-amber-900 mb-2">💎 Local Insider Knowledge</h4>
                  <p className="text-amber-800 text-sm">{selectedSignatureExperience.localInsight}</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h3 className="font-bold text-lg text-red-900 mb-3">🎯 Booking Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-red-800">Advance Booking Required:</span>
                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedSignatureExperience.bookingRequired ? 'Yes - 48-72 hours' : 'Walk-ins Welcome'}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-red-100">
                    <p className="text-gray-700 text-sm mb-3">
                      <strong>To book this exclusive experience:</strong>
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📞 Call Rio Nido Lodge Concierge: <span className="font-medium">(707) 869-0821</span></p>
                      <p>✉️ Email: <span className="font-medium">concierge@rionidolodge.com</span></p>
                      <p>🕐 Best to call between 9AM-5PM for immediate assistance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (window.gtag) {
                    window.gtag('event', 'signature_experience_interest', {
                      'custom_map': {'experience': selectedSignatureExperience.name},
                      'value': 1
                    });
                  }
                  window.open(`tel:(707) 869-0821`, '_self');
                }}
                className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg hover:from-red-800 hover:to-red-900 transition-all shadow-lg font-medium"
              >
                📞 Call to Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Check for shared itinerary on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('share');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setGuestData(prev => ({
          ...prev,
          name: decoded.guest,
          tripDuration: decoded.duration,
          travelStyle: decoded.style,
          interests: decoded.interests
        }));
        setCurrentStep('shared');
      } catch (e) {
        console.log('Invalid share link');
      }
    }
  }, []);

  // Get cluster display name
  const getClusterName = (cluster) => {
    const clusterNames = {
      'downtown': 'Downtown Guerneville',
      'sebastopol': 'Sebastopol Route',
      'occidental': 'Occidental Route', 
      'forestville': 'Forestville Route',
      'russian_river': 'Russian River Valley',
      'coastal': 'Coastal Adventures'
    };
    return clusterNames[cluster] || cluster;
  };

  // Main form component
  const GuestForm = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Plan Your Russian River Valley Experience</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
              <input
                type="text"
                value={guestData.name}
                onChange={(e) => setGuestData({...guestData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={guestData.email}
                onChange={(e) => setGuestData({...guestData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Duration</label>
              <select
                value={guestData.tripDuration}
                onChange={(e) => setGuestData({...guestData, tripDuration: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7].map(days => (
                  <option key={days} value={days}>{days} day{days > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Party Size</label>
              <select
                value={guestData.partySize}
                onChange={(e) => setGuestData({...guestData, partySize: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8].map(size => (
                  <option key={size} value={size}>{size} guest{size > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">What interests you? (Select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map(interest => (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  guestData.interests.includes(interest.id)
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                }`}
              >
                <div className="text-2xl mb-1">{interest.icon}</div>
                <div className="text-sm font-medium">{interest.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Your Travel Style</label>
          <div className="space-y-3">
            {travelStyles.map(style => (
              <label key={style.id} className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="travelStyle"
                  value={style.id}
                  checked={guestData.travelStyle === style.id}
                  onChange={(e) => setGuestData({...guestData, travelStyle: e.target.value})}
                  className="h-4 w-4 text-red-600 focus:ring-red-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{style.label}</div>
                  <div className="text-sm text-gray-600">{style.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Weather</label>
            <select
              value={guestData.weather}
              onChange={(e) => setGuestData({...guestData, weather: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="sunny">Sunny ☀️</option>
              <option value="cloudy">Partly Cloudy ⛅</option>
              <option value="rainy">Rainy 🌧️</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
            <input
              type="text"
              value={guestData.specialRequests}
              onChange={(e) => setGuestData({...guestData, specialRequests: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Accessibility, dietary restrictions, etc."
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (guestData.interests.length === 0) {
              alert('Please select at least one interest');
              return;
            }
            generateItinerary();
          }}
          className="w-full bg-gradient-to-r from-red-700 to-red-800 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-red-800 hover:to-red-900 transition-all shadow-lg"
        >
          Create My Curated Itinerary
        </button>
      </div>
    </div>
  );

  // Loading component
  const LoadingScreen = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
      <div className="animate-spin h-12 w-12 border-4 border-red-200 border-t-red-600 rounded-full mx-auto mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Curating Your Perfect Experience</h2>
      <div className="text-gray-600 space-y-2">
        <p>🗺️ Mapping optimal routes through wine country...</p>
        <p>⏰ Checking current business hours...</p>
        <p>🎯 Matching activities to your interests...</p>
        <p>✨ Adding local insider knowledge...</p>
      </div>
    </div>
  );

  // Itinerary display component
  const ItineraryDisplay = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-12 bg-gradient-to-br from-amber-600 to-red-800 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">RNL</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {guestData.name ? `${guestData.name}'s` : 'Your'} Curated Experience
              </h1>
              <p className="text-red-700 font-medium">
                {guestData.tripDuration} day{guestData.tripDuration > 1 ? 's' : ''} of authentic Russian River Valley discoveries
              </p>
            </div>
          </div>
          <div className="h-1 w-32 bg-red-800 mx-auto rounded-full"></div>
        </div>
      </div>

      {guestData.interests.includes('wine') || guestData.interests.includes('nature') ? (
        <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl shadow-lg p-6 mb-8 border border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">⭐</span>
            Exclusive Local Signature Experiences
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {signatureExperiences.map(experience => (
              <button
                key={experience.id}
                onClick={() => {
                  setSelectedSignatureExperience(experience);
                  setShowSignatureModal(true);
                }}
                className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer text-left"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-2">{experience.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{experience.description}</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>📍 {experience.distance} • {experience.duration}</div>
                  <div>💰 {experience.priceRange} • Max {experience.maxGuests} guests</div>
                  <div className="text-amber-700 font-medium">💎 {experience.localInsight}</div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                    Booking Required
                  </div>
                  <div className="text-red-600 text-sm font-medium hover:text-red-700">
                    Click for Details →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-8">
        {itinerary?.map(day => (
          <div key={day.day} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-6">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="bg-white text-red-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                  {day.day}
                </span>
                Day {day.day}
              </h2>
              <p className="text-red-100 mt-1">{day.date}</p>
              <div className="mt-2 text-red-200 text-sm">
                🗺️ {getClusterName(day.cluster)} Focus
              </div>
            </div>
            
            <div className="p-6">
              {day.activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🌲</div>
                  <h3 className="text-lg font-medium">Relaxation Day</h3>
                  <p>Perfect day to enjoy the lodge amenities or explore at your own pace</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold">
                          {activity.category === 'food' ? '🍽️' :
                           activity.category === 'coffee' ? '☕' :
                           activity.category === 'wine' ? '🍷' :
                           activity.category === 'arts' ? '🎨' :
                           activity.category === 'nature' ? '🌲' : '🛍️'}
                        </span>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{activity.name}</h3>
                            <p className="text-red-600 font-medium text-sm">{activity.type}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="flex items-center space-x-2">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                ⭐ {activity.rating}
                              </span>
                              <span className="text-gray-600 text-sm">{activity.priceRange}</span>
                              {isCurrentlyOpen(activity) && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Open Now
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-sm mt-1">{activity.driveTime}</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mt-2">{activity.description}</p>
                        
                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                          <div className="flex items-start">
                            <span className="text-amber-600 mr-2">💡</span>
                            <p className="text-amber-800 text-sm font-medium">{activity.localInsight}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-3 text-sm text-gray-600 space-x-4">
                          <span>⏰ Open {activity.hours.open}:00 - {activity.hours.close}:00</span>
                          <span>📍 {getClusterName(activity.cluster)}</span>
                          {activity.signature && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              ⭐ Signature Experience
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Share Your Itinerary</h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={() => navigator.clipboard?.writeText(shareableLink)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentStep('form')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
        >
          Create New Itinerary
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Print Itinerary
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-25 to-red-100">
      <div className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="w-20 h-16 bg-gradient-to-br from-amber-600 to-red-800 rounded-lg flex items-center justify-center mr-6 shadow-lg">
              <span className="text-white font-bold text-xl">RNL</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rio Nido Lodge</h1>
              <p className="text-red-600 font-medium">Curated Russian River Valley Experiences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentStep === 'form' && <GuestForm />}
        {currentStep === 'loading' && <LoadingScreen />}
        {(currentStep === 'itinerary' || currentStep === 'shared') && itinerary && <ItineraryDisplay />}
        {loading && <LoadingScreen />}
      </div>
      
      <SignatureExperienceModal />
    </div>
  );
};

export default RioNidoLodgeApp;
