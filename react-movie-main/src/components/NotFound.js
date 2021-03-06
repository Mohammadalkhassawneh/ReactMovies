import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div class="page-404 section--bg" data-bg="img/section/section.jpg">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="page-404__wrap">
                    <div class="page-404__content">
                        <h1 class="page-404__title">404</h1>
                        <p class="page-404__text">The page you are looking for not available!</p>
                        <Link className="page-404__btn" to="/">
                        go back
                      </Link>
                      
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}
