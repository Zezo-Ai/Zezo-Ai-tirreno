<?php

namespace Controllers\Admin\Rules\Set;

class C11 extends BaseRule {
    public const NAME = 'Russia IP address';
    public const DESCRIPTION = 'IP address located in Russia. This region is associated with a higher risk.';
    public const ATTRIBUTES = ['ip'];

    protected function prepareParams(array $params): array {
        $params['eip_has_specific_country'] = in_array(\Utils\Constants::get('COUNTRY_CODE_RUSSIA'), $params['eip_country_id']);

        return $params;
    }

    protected function defineCondition() {
        return $this->rb->logicalAnd(
            $this->rb['eip_has_specific_country']->equalTo(true),
        );
    }
}
