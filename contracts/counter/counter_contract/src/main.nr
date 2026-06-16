use dep::aztec::macros::aztec;

#[aztec]
pub contract Counter {
    use dep::aztec::{
        macros::{functions::{external, initializer}, storage::storage},
        oracle::logging::debug_log_format,
        protocol::address::AztecAddress,
        state_vars::{Map, private_uint::EasyPrivateUint},
    };

    #[storage]
    struct Storage<Context> {
        counters: Map<AztecAddress, EasyPrivateUint, Context>,
    }

    #[initializer]
    #[external("private")]
    fn initialize(headstart: u64, owner: AztecAddress) {
        debug_log_format("Initializing counter with headstart {0} for owner", [headstart as Field]);
        self.storage.counters.at(owner).add(headstart as u128);
    }

    #[external("private")]
    fn increment(owner: AztecAddress) {
        debug_log_format("Incrementing counter for owner {0}", [owner.to_field()]);
        self.storage.counters.at(owner).add(1);
    }

    #[external("utility")]
    unconstrained fn get_counter(owner: AztecAddress) -> pub u128 {
        self.storage.counters.at(owner).balance_of()
    }
}
