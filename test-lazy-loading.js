// Test script for lazy loading verification
// Add this to your browser console or include in your page

console.log('=== LAZY LOADING TEST ===');

// Function to test lazy loading
function testLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    console.log(`Found ${images.length} lazy-loaded images`);
    
    // Check which images are currently loaded
    let loadedCount = 0;
    let notLoadedCount = 0;
    
    images.forEach((img, index) => {
        if (img.complete && img.naturalHeight !== 0) {
            loadedCount++;
            console.log(`Image ${index + 1}: LOADED (${img.src})`);
        } else {
            notLoadedCount++;
            console.log(`Image ${index + 1}: NOT LOADED (${img.src})`);
        }
    });
    
    console.log(`\nSummary: ${loadedCount} loaded, ${notLoadedCount} not loaded`);
    
    // Monitor for new images loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('🔄 Image entering viewport:', entry.target.src);
            }
        });
    });
    
    images.forEach(img => observer.observe(img));
    
    return { loadedCount, notLoadedCount, totalCount: images.length };
}

// Run the test
const results = testLazyLoading();

// Additional test: Scroll to bottom and check again
setTimeout(() => {
    console.log('\n=== SCROLLING TO BOTTOM ===');
    window.scrollTo(0, document.body.scrollHeight);
    
    setTimeout(() => {
        const newResults = testLazyLoading();
        console.log(`\nAfter scrolling: ${newResults.loadedCount}/${newResults.totalCount} images loaded`);
    }, 2000);
}, 1000);
