<template>
    <div class="w-full">
        <div class="container mx-auto max-w-screen-lg">
            <main
                id="wrapper"
                class="flex flex-col md:flex-row lg:m-12 shadow-2xl print:shadow print:m-0 print:shadow-none"
            >
                <div class="w-full md:max-w-xs p-8 print:p-0 bg-blue-50">
                    <div class="px-2 print:px-0">
                        <!-- @slot sidebar -->
                        <slot name="sidebar"></slot>
                    </div>
                </div>
                <div class="w-full p-12 print:p-0">
                    <!-- @slot default -->
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>
