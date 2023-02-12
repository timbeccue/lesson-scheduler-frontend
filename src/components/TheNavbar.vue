<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Lesson Scheduler</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Scheduling</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/roadmap">Feature Roadmap</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<style scoped>
</style>