<template>
<div class="divider">
    <span class="icon-group">
        <Icon name="tabler:bike" />
        <Icon name="tabler:bike" />
        <Icon name="tabler:bike" />
    </span>
</div>
</template>

<style>
.divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-inline: 2rem;
    padding-block: .5rem;

    .icon-group {
        display: flex;
        align-items: center;
        gap: 5px;

        span {
            height: 18px;
            width: 18px;
        }
    }

    &::before,
    &::after {
        content: "";
        flex: 1;
        height: 1px;
        background:var(--clr-primary-mute);
    }

    color: var(--clr-primary-mute);
}
</style>
