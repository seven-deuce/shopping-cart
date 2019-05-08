( function( window, document ) {

   const updateBasket = () => {
      document.addEventListener( "DOMContentLoaded", () => {
         fetch( "/basket" ).then( res => res.json() ).then( res => {
            console.log( res )
            if ( res ) { document.querySelector( "a span#count" ).innerText = res } else { document.querySelector( "a span#count" ).style.display = "none" }
         } )
      } )
   }

   updateBasket() // run on every page load

// event handler for adding items into basket
   const btn = document.querySelectorAll( "button.add" )
   Array.from( btn ).forEach( item => {
      item.addEventListener( "click", event => {
         const id = event.target.id
         fetch( `/add/${id}` ).then( res => res.json() ).then( res => console.log( res ) )

         window.location.reload( true ) // reload the page, because there is no React.js around for updating the state! 
      } )
   } )


} )( window, document )