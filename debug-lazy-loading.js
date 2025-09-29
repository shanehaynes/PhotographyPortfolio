// Debug script for your actual website
// Add this to your browser console when testing your site

console.log('=== LAZY LOADING DEBUG ===');

// Function to check lazy loading status
function debugLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    console.log(`Found ${images.length} lazy-loaded images`);
    
    let loadedCount = 0;
    let notLoadedCount = 0;
    let inViewportCount = 0;
    
    images.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) inViewportCount++;
        
        if (img.complete && img.naturalHeight !== 0) {
            loadedCount++;
            console.log(`✅ Image ${index + 1}: LOADED (${img.src.split('/').pop()})`);
        } else {
            notLoadedCount++;
            console.log(`⏳ Image ${index + 1}: NOT LOADED (${img.src.split('/').pop()})`);
        }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total images: ${images.length}`);
    console.log(`   Loaded: ${loadedCount}`);
    console.log(`   Not loaded: ${notLoadedCount}`);
    console.log(`   In viewport: ${inViewportCount}`);
    console.log(`   Viewport height: ${window.innerHeight}px`);
    
    return { loadedCount, notLoadedCount, inViewportCount, totalCount: images.length };
}

// Monitor for new loads
function startMonitoring() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach((img, index) => {
        img.addEventListener('load', function() {
            console.log(`🔄 Image ${index + 1} just loaded: ${this.src.split('/').pop()}`);
        });
    });
    
    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`👁️ Image entering viewport: ${entry.target.src.split('/').pop()}`);
            }
        });
    });
    
    images.forEach(img => observer.observe(img));
    console.log('🔍 Monitoring started - scroll to see lazy loading in action');
}

// Run initial check
const results = debugLazyLoading();

// Start monitoring
startMonitoring();

// Test after scrolling
setTimeout(() => {
    console.log('\n=== AFTER 3 SECONDS ===');
    debugLazyLoading();
}, 3000);
