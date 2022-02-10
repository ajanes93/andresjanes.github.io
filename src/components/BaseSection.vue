<template>
    <div>
        <h2 class="text-xl font-bold text-blue-600 print:text-black">
            <!-- @slot title -->
            <slot name="title">Section</slot>
        </h2>
        <!-- @slot default -->
        <slot></slot>
    </div>
</template>
