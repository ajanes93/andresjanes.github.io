<template>
    <div>
        <h2 class="text-lg font-semibold text-center mb-4">
            <!-- @slot title -->
            <slot name="title">Section</slot>
        </h2>
        <!-- @slot default -->
        <slot></slot>
    </div>
</template>
