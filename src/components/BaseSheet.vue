<template>
    <div class="w-full">
        <div class="container mx-auto max-w-screen-lg print:w-full">
            <main
                id="wrapper"
                class="flex flex-col md:flex-row lg:m-12 shadow-2xl print:shadow-none print:flex-row print:m-0"
            >
                <div id="sidebar" class="w-full md:max-w-xs p-8 bg-blue-50 print:w-96 print:shadow-none">
                    <div class="px-2">
                        <!-- @slot sidebar -->
                        <slot name="sidebar"></slot>
                    </div>
                </div>
                <div class="w-full p-12 print:py-0 print:px-3">
                    <!-- @slot default -->
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>
